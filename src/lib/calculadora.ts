/**
 * Motor de la calculadora.
 *
 * Es código puro (sin React ni React Native) para que la lógica sea fácil de
 * probar y de reutilizar. Toda la interfaz envía "acciones" y este reductor
 * devuelve el nuevo estado de la calculadora.
 */

/** Máximo de dígitos que se pueden escribir en una entrada. */
export const MAX_DIGITOS = 12;

/** Máximo de operaciones que se conservan en el historial. */
export const MAX_HISTORIAL = 20;

export type Operador = "+" | "−" | "×" | "÷";

export interface CalculoHistorial {
  expresion: string;
  resultado: string;
}

export interface EstadoCalculadora {
  /** Valor que se muestra en la pantalla principal (sin separadores). */
  pantalla: string;
  /** Operando acumulado de la operación pendiente. */
  anterior: number | null;
  /** Operador pendiente. */
  operador: Operador | null;
  /** true cuando el siguiente dígito debe iniciar una entrada nueva. */
  esperando: boolean;
  /** Línea secundaria: la operación que se está realizando. */
  expresion: string;
  /** true cuando ocurrió un error (por ejemplo, división entre cero). */
  error: boolean;
  /** Última operación, para repetirla al pulsar "=" varias veces. */
  repeticion: { operador: Operador; operando: number } | null;
  /** Operaciones resueltas, de la más reciente a la más antigua. */
  historial: CalculoHistorial[];
}

export type AccionCalculadora =
  | { tipo: "digito"; digito: string }
  | { tipo: "decimal" }
  | { tipo: "operador"; operador: Operador }
  | { tipo: "igual" }
  | { tipo: "limpiar" }
  | { tipo: "borrar" }
  | { tipo: "cambiarSigno" }
  | { tipo: "porcentaje" }
  | { tipo: "limpiarHistorial" };

export const ESTADO_INICIAL: EstadoCalculadora = {
  pantalla: "0",
  anterior: null,
  operador: null,
  esperando: true,
  expresion: "",
  error: false,
  repeticion: null,
  historial: [],
};

type ResultadoCalculo =
  | { ok: true; valor: number }
  | { ok: false; mensaje: string };

/**
 * Redondea a 12 cifras significativas para evitar artefactos de punto flotante
 * (por ejemplo, 0.1 + 0.2 = 0.30000000000000004).
 */
function redondear(valor: number): number {
  if (!Number.isFinite(valor)) return Number.NaN;
  return Number.parseFloat(valor.toPrecision(12));
}

/** Convierte un número a texto sin ceros sobrantes. */
export function formatear(valor: number): string {
  if (!Number.isFinite(valor)) return "Error";
  const redondeado = redondear(valor);
  if (Object.is(redondeado, -0)) return "0";
  return String(redondeado);
}

/**
 * Da formato de lectura a un valor ya convertido a texto: agrupa los miles con
 * comas y respeta el punto decimal y los exponentes.
 */
export function formatearParaMostrar(texto: string): string {
  if (texto === "Error" || texto === "") return texto;
  if (texto.includes("e") || texto.includes("E")) return texto;

  const negativo = texto.startsWith("-");
  const sinSigno = negativo ? texto.slice(1) : texto;
  const [entero, decimales] = sinSigno.split(".");

  const agrupado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const signo = negativo ? "-" : "";
  return decimales === undefined
    ? `${signo}${agrupado}`
    : `${signo}${agrupado}.${decimales}`;
}

/** Realiza una operación y devuelve un error legible cuando no es válida. */
export function calcular(
  a: number,
  b: number,
  operador: Operador,
): ResultadoCalculo {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { ok: false, mensaje: "Número no válido" };
  }

  let resultado: number;

  switch (operador) {
    case "+":
      resultado = a + b;
      break;
    case "−":
      resultado = a - b;
      break;
    case "×":
      resultado = a * b;
      break;
    case "÷":
      if (b === 0) {
        return { ok: false, mensaje: "No se puede dividir entre cero" };
      }
      resultado = a / b;
      break;
  }

  if (!Number.isFinite(resultado)) {
    return { ok: false, mensaje: "El resultado es demasiado grande" };
  }

  return { ok: true, valor: redondear(resultado) };
}

function contarDigitos(texto: string): number {
  return texto.replace(/\D/g, "").length;
}

function agregarHistorial(
  historial: CalculoHistorial[],
  expresion: string,
  resultado: string,
): CalculoHistorial[] {
  return [{ expresion, resultado }, ...historial].slice(0, MAX_HISTORIAL);
}

function estadoConError(
  estado: EstadoCalculadora,
  mensaje: string,
): EstadoCalculadora {
  return {
    ...estado,
    pantalla: "Error",
    anterior: null,
    operador: null,
    esperando: true,
    expresion: mensaje,
    error: true,
    repeticion: null,
  };
}

function ingresarDigito(
  estado: EstadoCalculadora,
  digito: string,
): EstadoCalculadora {
  if (!/^\d$/.test(digito)) return estado;

  // Tras un error, cualquier número inicia una calculadora limpia.
  if (estado.error) {
    return {
      ...ESTADO_INICIAL,
      pantalla: digito,
      esperando: false,
      historial: estado.historial,
    };
  }

  if (estado.esperando) {
    return {
      ...estado,
      pantalla: digito,
      esperando: false,
      // Si venimos de "=", la expresión anterior ya no aplica.
      expresion: estado.operador === null ? "" : estado.expresion,
      repeticion: null,
    };
  }

  if (estado.pantalla === "0") {
    return { ...estado, pantalla: digito, repeticion: null };
  }

  if (contarDigitos(estado.pantalla) >= MAX_DIGITOS) {
    return estado;
  }

  return {
    ...estado,
    pantalla: `${estado.pantalla}${digito}`,
    repeticion: null,
  };
}

function ingresarDecimal(estado: EstadoCalculadora): EstadoCalculadora {
  if (estado.error) {
    return {
      ...ESTADO_INICIAL,
      pantalla: "0.",
      esperando: false,
      historial: estado.historial,
    };
  }

  if (estado.esperando) {
    return {
      ...estado,
      pantalla: "0.",
      esperando: false,
      expresion: estado.operador === null ? "" : estado.expresion,
      repeticion: null,
    };
  }

  if (estado.pantalla.includes(".")) return estado;
  if (contarDigitos(estado.pantalla) >= MAX_DIGITOS) return estado;

  return {
    ...estado,
    pantalla: `${estado.pantalla}.`,
    repeticion: null,
  };
}

function elegirOperador(
  estado: EstadoCalculadora,
  operador: Operador,
): EstadoCalculadora {
  if (estado.error) return estado;

  const valorActual = Number(estado.pantalla);
  const hayOperacionPendiente =
    estado.anterior !== null && estado.operador !== null;

  // Encadenar operaciones: 2 + 3 + ... resuelve 2 + 3 antes de continuar.
  if (hayOperacionPendiente && !estado.esperando) {
    const resultado = calcular(estado.anterior!, valorActual, estado.operador!);

    if (!resultado.ok) return estadoConError(estado, resultado.mensaje);

    return {
      ...estado,
      pantalla: formatear(resultado.valor),
      anterior: resultado.valor,
      operador,
      esperando: true,
      expresion: `${formatearParaMostrar(formatear(resultado.valor))} ${operador}`,
      repeticion: null,
    };
  }

  const base = hayOperacionPendiente ? estado.anterior! : valorActual;
  const baseMostrada = hayOperacionPendiente
    ? formatear(base)
    : estado.pantalla;

  return {
    ...estado,
    anterior: base,
    operador,
    esperando: true,
    expresion: `${formatearParaMostrar(baseMostrada)} ${operador}`,
    repeticion: null,
  };
}

function resolverIgual(estado: EstadoCalculadora): EstadoCalculadora {
  if (estado.error) return estado;

  if (estado.anterior !== null && estado.operador !== null) {
    const operando = Number(estado.pantalla);
    const resultado = calcular(estado.anterior, operando, estado.operador);

    if (!resultado.ok) return estadoConError(estado, resultado.mensaje);

    const expresion = `${formatearParaMostrar(
      formatear(estado.anterior),
    )} ${estado.operador} ${formatearParaMostrar(estado.pantalla)} =`;
    const pantalla = formatear(resultado.valor);

    return {
      ...estado,
      pantalla,
      anterior: null,
      operador: null,
      esperando: true,
      expresion,
      repeticion: { operador: estado.operador, operando },
      historial: agregarHistorial(estado.historial, expresion, pantalla),
    };
  }

  // Pulsar "=" otra vez repite la última operación.
  if (estado.repeticion) {
    const base = Number(estado.pantalla);
    const { operador, operando } = estado.repeticion;
    const resultado = calcular(base, operando, operador);

    if (!resultado.ok) return estadoConError(estado, resultado.mensaje);

    const expresion = `${formatearParaMostrar(
      formatear(base),
    )} ${operador} ${formatearParaMostrar(formatear(operando))} =`;
    const pantalla = formatear(resultado.valor);

    return {
      ...estado,
      pantalla,
      anterior: null,
      operador: null,
      esperando: true,
      expresion,
      historial: agregarHistorial(estado.historial, expresion, pantalla),
    };
  }

  return estado;
}

function borrar(estado: EstadoCalculadora): EstadoCalculadora {
  if (estado.error) {
    return { ...ESTADO_INICIAL, historial: estado.historial };
  }

  if (estado.esperando) {
    if (estado.anterior !== null && estado.operador !== null) {
      // Cancelar la operación pendiente y volver al operando acumulado.
      return {
        ...estado,
        pantalla: formatear(estado.anterior),
        anterior: null,
        operador: null,
        esperando: true,
        expresion: "",
        repeticion: null,
      };
    }

    return {
      ...estado,
      pantalla: "0",
      expresion: "",
      esperando: true,
      repeticion: null,
    };
  }

  let pantalla = estado.pantalla.slice(0, -1);
  if (pantalla === "" || pantalla === "-") pantalla = "0";

  return { ...estado, pantalla, repeticion: null };
}

function cambiarSigno(estado: EstadoCalculadora): EstadoCalculadora {
  if (estado.error || estado.pantalla === "0") return estado;

  const pantalla = estado.pantalla.startsWith("-")
    ? estado.pantalla.slice(1)
    : `-${estado.pantalla}`;

  return { ...estado, pantalla, repeticion: null };
}

function aplicarPorcentaje(estado: EstadoCalculadora): EstadoCalculadora {
  if (estado.error) return estado;

  const valor = Number(estado.pantalla);
  const esSumaOResta = estado.operador === "+" || estado.operador === "−";

  // En una suma o resta el porcentaje es relativo al operando acumulado
  // (200 + 10 % = 220). En el resto de los casos solo divide entre 100.
  const resultado =
    estado.anterior !== null && esSumaOResta
      ? (estado.anterior * valor) / 100
      : valor / 100;

  // Si se aplica después de "=", se inicia una cuenta nueva.
  const iniciaCuenta =
    estado.anterior === null &&
    estado.operador === null &&
    estado.repeticion !== null;

  return {
    ...estado,
    pantalla: formatear(resultado),
    esperando: false,
    expresion: iniciaCuenta ? "" : estado.expresion,
    repeticion: null,
  };
}

export function reductorCalculadora(
  estado: EstadoCalculadora,
  accion: AccionCalculadora,
): EstadoCalculadora {
  switch (accion.tipo) {
    case "digito":
      return ingresarDigito(estado, accion.digito);
    case "decimal":
      return ingresarDecimal(estado);
    case "operador":
      return elegirOperador(estado, accion.operador);
    case "igual":
      return resolverIgual(estado);
    case "limpiar":
      return { ...ESTADO_INICIAL, historial: estado.historial };
    case "borrar":
      return borrar(estado);
    case "cambiarSigno":
      return cambiarSigno(estado);
    case "porcentaje":
      return aplicarPorcentaje(estado);
    case "limpiarHistorial":
      return { ...estado, historial: [] };
    default:
      return estado;
  }
}
