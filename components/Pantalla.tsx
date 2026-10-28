import { StyleSheet, Text, View } from "react-native";

import { colores } from "../src/tema/colores";

interface PantallaProps {
  /** Valor principal ya formateado para mostrar. */
  valor: string;
  /** Operación en curso o mensaje de error. */
  expresion?: string;
  error?: boolean;
}

export default function Pantalla({
  valor,
  expresion = "",
  error = false,
}: PantallaProps) {
  // Reduce el tamaño de la letra cuando el número es muy largo.
  const tamano =
    valor.length > 14 ? 30 : valor.length > 11 ? 38 : valor.length > 9 ? 48 : 70;

  return (
    <View style={styles.contenedor}>
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={[styles.expresion, error && styles.expresionError]}
      >
        {expresion}
      </Text>

      <Text
        accessibilityRole="text"
        accessibilityLabel={`Resultado: ${valor}`}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
        style={[
          styles.valor,
          { fontSize: tamano, lineHeight: tamano * 1.08 },
          error && styles.valorError,
        ]}
      >
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 22,
    gap: 6,
  },
  expresion: {
    color: colores.textoSuave,
    fontSize: 22,
    fontWeight: "500",
    textAlign: "right",
    minHeight: 28,
  },
  expresionError: {
    color: colores.error,
    fontWeight: "600",
  },
  valor: {
    color: colores.texto,
    fontWeight: "300",
    textAlign: "right",
  },
  valorError: {
    color: colores.error,
    fontWeight: "500",
  },
});
