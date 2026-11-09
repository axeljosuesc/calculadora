import { useCallback, useEffect, useMemo, useReducer } from "react";
import { Platform } from "react-native";

import {
  ESTADO_INICIAL,
  formatearParaMostrar,
  reductorCalculadora,
  type Operador,
} from "../lib/calculadora";

/**
 * Conecta el motor de la calculadora con React y añade el soporte de teclado
 * físico en la versión web.
 */
export function useCalculadora({
  atajosDeTeclado = true,
}: { atajosDeTeclado?: boolean } = {}) {
  const [estado, despachar] = useReducer(
    reductorCalculadora,
    ESTADO_INICIAL,
  );

  const digito = useCallback(
    (valor: string) => despachar({ tipo: "digito", digito: valor }),
    [],
  );
  const decimal = useCallback(() => despachar({ tipo: "decimal" }), []);
  const operador = useCallback(
    (valor: Operador) => despachar({ tipo: "operador", operador: valor }),
    [],
  );
  const igual = useCallback(() => despachar({ tipo: "igual" }), []);
  const operacionVoz = useCallback(
    (primerNumero: number, operador: Operador, segundoNumero: number) =>
      despachar({ tipo: "operacionVoz", primerNumero, operador, segundoNumero }),
    [],
  );
  const limpiar = useCallback(() => despachar({ tipo: "limpiar" }), []);
  const borrar = useCallback(() => despachar({ tipo: "borrar" }), []);
  const cambiarSigno = useCallback(
    () => despachar({ tipo: "cambiarSigno" }),
    [],
  );
  const porcentaje = useCallback(() => despachar({ tipo: "porcentaje" }), []);
  const limpiarHistorial = useCallback(
    () => despachar({ tipo: "limpiarHistorial" }),
    [],
  );

  useEffect(() => {
    if (
      !atajosDeTeclado ||
      Platform.OS !== "web" ||
      typeof window === "undefined"
    ) {
      return;
    }

    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.ctrlKey || evento.metaKey || evento.altKey) return;

      const objetivo = evento.target as HTMLElement | null;
      const estaEscribiendo =
        objetivo?.tagName === "INPUT" ||
        objetivo?.tagName === "TEXTAREA" ||
        objetivo?.isContentEditable;
      if (estaEscribiendo) return;

      const tecla = evento.key;

      if (/^\d$/.test(tecla)) {
        despachar({ tipo: "digito", digito: tecla });
      } else if (tecla === "." || tecla === ",") {
        despachar({ tipo: "decimal" });
      } else if (tecla === "+") {
        despachar({ tipo: "operador", operador: "+" });
      } else if (tecla === "-") {
        despachar({ tipo: "operador", operador: "−" });
      } else if (tecla === "*" || tecla.toLowerCase() === "x") {
        despachar({ tipo: "operador", operador: "×" });
      } else if (tecla === "/") {
        despachar({ tipo: "operador", operador: "÷" });
      } else if (tecla === "Enter" || tecla === "=") {
        despachar({ tipo: "igual" });
      } else if (tecla === "Backspace") {
        despachar({ tipo: "borrar" });
      } else if (tecla === "Escape" || tecla === "Delete") {
        despachar({ tipo: "limpiar" });
      } else if (tecla === "%") {
        despachar({ tipo: "porcentaje" });
      } else {
        return;
      }

      // Se captura la tecla antes que los botones para que Enter calcule en
      // lugar de volver a pulsar el botón que tiene el foco.
      evento.preventDefault();
      evento.stopPropagation();
    };

    window.addEventListener("keydown", alPresionarTecla, true);
    return () => window.removeEventListener("keydown", alPresionarTecla, true);
  }, [atajosDeTeclado, despachar]);

  const valor = useMemo(
    () => (estado.error ? "Error" : formatearParaMostrar(estado.pantalla)),
    [estado.error, estado.pantalla],
  );

  return {
    valor,
    expresion: estado.expresion,
    error: estado.error,
    historial: estado.historial,
    digito,
    decimal,
    operador,
    igual,
    operacionVoz,
    limpiar,
    borrar,
    cambiarSigno,
    porcentaje,
    limpiarHistorial,
  };
}
