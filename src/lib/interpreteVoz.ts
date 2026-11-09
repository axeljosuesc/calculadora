import type { Operador } from "./calculadora";

export interface OperacionReconocida {
  primerNumero: number;
  operador: Operador;
  segundoNumero: number;
}

const numeros = new Map<string, number>([
  ["cero", 0], ["un", 1], ["uno", 1], ["una", 1], ["dos", 2],
  ["tres", 3], ["cuatro", 4], ["cinco", 5], ["seis", 6], ["siete", 7],
  ["ocho", 8], ["nueve", 9], ["diez", 10], ["once", 11], ["doce", 12],
  ["trece", 13], ["catorce", 14], ["quince", 15], ["dieciseis", 16],
  ["diecisiete", 17], ["dieciocho", 18], ["diecinueve", 19], ["veinte", 20],
  ["veintiuno", 21], ["veintiun", 21], ["veintidos", 22], ["veintitres", 23],
  ["veinticuatro", 24], ["veinticinco", 25], ["veintiseis", 26],
  ["veintisiete", 27], ["veintiocho", 28], ["veintinueve", 29],
  ["treinta", 30], ["cuarenta", 40], ["cincuenta", 50], ["sesenta", 60],
  ["setenta", 70], ["ochenta", 80], ["noventa", 90], ["cien", 100],
  ["ciento", 100], ["doscientos", 200], ["trescientos", 300],
  ["cuatrocientos", 400], ["quinientos", 500], ["seiscientos", 600],
  ["setecientos", 700], ["ochocientos", 800], ["novecientos", 900],
]);

function parsearNumero(texto: string): number | null {
  const limpio = texto.trim().replace(/^(?:el resultado de|cuanto es|cuanto|calcula|resuelve|dime)\s+/, "");
  const numerico = limpio.match(/^-?\d+(?:[.,]\d+)?$/);
  if (numerico) return Number(numerico[0].replace(",", "."));

  const tokens = limpio.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;

  const separadorDecimal = tokens.findIndex((token) => token === "coma" || token === "punto");
  const tokensEnteros = separadorDecimal >= 0 ? tokens.slice(0, separadorDecimal) : tokens;
  const tokensDecimales = separadorDecimal >= 0 ? tokens.slice(separadorDecimal + 1) : [];
  if (tokensEnteros.length === 0) return null;

  let total = 0;
  let grupo = 0;
  for (const token of tokensEnteros) {
    if (token === "y") continue;
    if (token === "mil") {
      total += (grupo || 1) * 1000;
      grupo = 0;
      continue;
    }
    const valor = numeros.get(token);
    if (valor === undefined) return null;
    if (valor === 100) grupo = (grupo || 1) * valor;
    else if (valor >= 200 && valor % 100 === 0) grupo += valor;
    else grupo += valor;
  }

  let resultado = total + grupo;
  if (tokensDecimales.length > 0) {
    const digitos: string[] = [];
    for (const token of tokensDecimales) {
      if (token === "y") continue;
      if (/^\d+$/.test(token)) digitos.push(token);
      else {
        const valor = numeros.get(token);
        if (valor === undefined || valor > 9) return null;
        digitos.push(String(valor));
      }
    }
    if (digitos.length === 0) return null;
    resultado += Number(`0.${digitos.join("")}`);
  }

  return Number.isFinite(resultado) ? resultado : null;
}

/** Interpreta una operación aritmética breve dictada en español. */
export function interpretarOperacionVoz(transcripcion: string): OperacionReconocida | null {
  const normalizada = transcripcion
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!]/g, " ")
    .replace(/[.!]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const patrones: { regex: RegExp; operador: Operador }[] = [
    { regex: /\s+(?:mas|sumado a)\s+/, operador: "+" },
    { regex: /\s+menos\s+/, operador: "−" },
    { regex: /\s+(?:multiplicado por|por|veces|x)\s+/, operador: "×" },
    { regex: /\s+(?:dividido entre|dividido para|dividido por|entre)\s+/, operador: "÷" },
    { regex: /\s*\+\s*/, operador: "+" },
    { regex: /\s*[-−]\s*/, operador: "−" },
    { regex: /\s*[×*]\s*/, operador: "×" },
    { regex: /\s*[÷/]\s*/, operador: "÷" },
  ];

  for (const { regex, operador } of patrones) {
    const coincidencia = regex.exec(normalizada);
    if (!coincidencia || coincidencia.index === undefined) continue;
    const izquierda = normalizada.slice(0, coincidencia.index).trim();
    const derecha = normalizada.slice(coincidencia.index + coincidencia[0].length).trim();
    const primerNumero = parsearNumero(izquierda);
    const segundoNumero = parsearNumero(derecha);
    if (primerNumero !== null && segundoNumero !== null) {
      return { primerNumero, operador, segundoNumero };
    }
  }

  return null;
}
