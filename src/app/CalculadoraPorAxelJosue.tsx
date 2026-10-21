
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Boton from "../../components/Boton";

export default function Index() {
  return (
    <View style={styles.contenedor}>
      <StatusBar barStyle="dark-content" />

      {/* Pantalla de resultados */}
      <View style={styles.pantalla}>
        <Text style={styles.resultado}>1</Text>
      </View>

      {/* Teclado */}
      <View style={styles.teclado}>
        <View style={styles.fila}>
          <Boton valor="AC" operador />
          <Boton valor="⌫" operador />
          <Boton valor="+/-" operador />
          <Boton valor="÷" operador />
        </View>

        <View style={styles.fila}>
          <Boton valor="7" />
          <Boton valor="8" />
          <Boton valor="9" />
          <Boton valor="×" operador />
        </View>

        <View style={styles.fila}>
          <Boton valor="4" />
          <Boton valor="5" />
          <Boton valor="6" />
          <Boton valor="−" operador />
        </View>

        <View style={styles.fila}>
          <Boton valor="1" />
          <Boton valor="2" />
          <Boton valor="3" />
          <Boton valor="+" operador />
        </View>

        <View style={styles.fila}>
          <Boton valor="%" operador />
          <Boton valor="0" />
          <Boton valor="." />
          <Boton valor="=" operador />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFF3C4",
    paddingHorizontal: 18,
    paddingBottom: 35,
    justifyContent: "flex-end",
  },
  pantalla: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingBottom: 35,
  },
  resultado: {
    color: "#253746",
    fontSize: 70,
    fontWeight: "300",
  },
  teclado: {
    gap: 10,
  },
  fila: {
    flexDirection: "row",
    gap: 10,
  },
});
