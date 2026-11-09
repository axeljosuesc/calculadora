import { Pressable, Platform, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";

import { colores } from "../src/tema/colores";

export type TipoBoton = "numero" | "funcion" | "operador" | "igual";

interface BotonProps {
  /** Texto visible de la tecla. */
  valor: string;
  /** Acción que se ejecuta al pulsar. */
  onPress?: () => void;
  /** Estilo visual de la tecla. */
  tipo?: TipoBoton;
  /** Ocupa el doble de ancho (útil para la tecla 0). */
  anchoDoble?: boolean;
  /** Etiqueta para lectores de pantalla; por defecto usa el valor. */
  etiqueta?: string;
  deshabilitado?: boolean;
}

export default function Boton({
  valor,
  onPress,
  tipo = "numero",
  anchoDoble = false,
  etiqueta,
  deshabilitado = false,
}: BotonProps) {
  const presionar = () => {
    if (Platform.OS !== "web") {
      const estilo = valor === "="
        ? Haptics.ImpactFeedbackStyle.Medium
        : valor === "AC"
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light;
      void Haptics.impactAsync(estilo).catch(() => undefined);
    }
    onPress?.();
  };

  return (
    <Pressable
      testID={`tecla-${valor}`}
      accessibilityRole="button"
      accessibilityLabel={etiqueta ?? valor}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={presionar}
      android_ripple={{ color: "rgba(255, 255, 255, 0.45)" }}
      style={({ pressed }) => [
        styles.boton,
        tipo === "funcion" && styles.funcion,
        tipo === "operador" && styles.operador,
        tipo === "igual" && styles.igual,
        anchoDoble && styles.doble,
        pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.texto,
          tipo === "funcion" && styles.textoFuncion,
          tipo === "operador" && styles.textoOperador,
          tipo === "igual" && styles.textoIgual,
          anchoDoble && styles.textoDoble,
        ]}
      >
        {valor}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    height: 64,
    backgroundColor: colores.boton,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    elevation: 2,
    shadowColor: colores.texto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  funcion: {
    backgroundColor: colores.botonFuncion,
  },
  operador: {
    backgroundColor: colores.boton,
  },
  igual: {
    backgroundColor: colores.acento,
  },
  doble: {
    flex: 2.15,
  },
  presionado: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },
  deshabilitado: {
    opacity: 0.45,
  },
  texto: {
    color: colores.texto,
    fontSize: 25,
    fontWeight: "600",
  },
  textoFuncion: {
    fontSize: 22,
    fontWeight: "700",
  },
  textoOperador: {
    color: colores.operador,
    fontSize: 28,
    fontWeight: "800",
  },
  textoIgual: {
    color: colores.textoSobreAcento,
    fontSize: 30,
    fontWeight: "700",
  },
  textoDoble: {
    textAlign: "left",
    paddingLeft: 26,
  },
});
