
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface BotonProps {
  valor: string;
  anchoDoble?: boolean;
  operador?: boolean;
}

export default function Boton({
  valor,
  anchoDoble = false,
  operador = false,
}: BotonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.boton,
        anchoDoble && styles.doble,
      ]}
    >
      <Text
        style={[
          styles.texto,
          operador && styles.simbolo,
        ]}
      >
        {valor}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    height: 65,
    backgroundColor: "#A9D6E5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  doble: {
    flex: 2.15,
  },
  texto: {
    color: "#253746",
    fontSize: 25,
    fontWeight: "600",
  },
  simbolo: {
    color: "#E5A000",
    fontWeight: "bold",
    fontSize: 28,
  },
});
