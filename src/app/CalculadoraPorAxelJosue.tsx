import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Boton from "../../components/Boton";
import Historial from "../../components/Historial";
import Pantalla from "../../components/Pantalla";
import { useCalculadora } from "../hooks/useCalculadora";
import { colores } from "../tema/colores";

export default function CalculadoraPorAxelJosue() {
  const [historialVisible, setHistorialVisible] = useState(false);
  const calculadora = useCalculadora({ atajosDeTeclado: !historialVisible });

  return (
    <SafeAreaView style={styles.seguro} edges={["top", "bottom"]}>
      <View style={styles.contenedor}>
        <View style={styles.encabezado}>
          <View>
            <Text style={styles.titulo}>Calculadora</Text>
            <Text style={styles.subtitulo}>Básica</Text>
          </View>

          <Pressable
            onPress={() => setHistorialVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir historial de operaciones"
            style={({ pressed }) => [
              styles.botonHistorial,
              pressed && styles.botonHistorialPresionado,
            ]}
          >
            <Text style={styles.textoHistorial}>Historial</Text>
            {calculadora.historial.length > 0 && (
              <View style={styles.indicadorHistorial} />
            )}
          </Pressable>
        </View>

        <Pantalla
          valor={calculadora.valor}
          expresion={calculadora.expresion}
          error={calculadora.error}
        />

        <View style={styles.teclado}>
          <View style={styles.fila}>
            <Boton
              valor="AC"
              tipo="funcion"
              etiqueta="Limpiar todo"
              onPress={calculadora.limpiar}
            />
            <Boton
              valor="⌫"
              tipo="funcion"
              etiqueta="Borrar último dígito"
              onPress={calculadora.borrar}
            />
            <Boton
              valor="+/-"
              tipo="funcion"
              etiqueta="Cambiar signo"
              onPress={calculadora.cambiarSigno}
            />
            <Boton
              valor="÷"
              tipo="operador"
              etiqueta="Dividir"
              onPress={() => calculadora.operador("÷")}
            />
          </View>

          <View style={styles.fila}>
            <Boton valor="7" onPress={() => calculadora.digito("7")} />
            <Boton valor="8" onPress={() => calculadora.digito("8")} />
            <Boton valor="9" onPress={() => calculadora.digito("9")} />
            <Boton
              valor="×"
              tipo="operador"
              etiqueta="Multiplicar"
              onPress={() => calculadora.operador("×")}
            />
          </View>

          <View style={styles.fila}>
            <Boton valor="4" onPress={() => calculadora.digito("4")} />
            <Boton valor="5" onPress={() => calculadora.digito("5")} />
            <Boton valor="6" onPress={() => calculadora.digito("6")} />
            <Boton
              valor="−"
              tipo="operador"
              etiqueta="Restar"
              onPress={() => calculadora.operador("−")}
            />
          </View>

          <View style={styles.fila}>
            <Boton valor="1" onPress={() => calculadora.digito("1")} />
            <Boton valor="2" onPress={() => calculadora.digito("2")} />
            <Boton valor="3" onPress={() => calculadora.digito("3")} />
            <Boton
              valor="+"
              tipo="operador"
              etiqueta="Sumar"
              onPress={() => calculadora.operador("+")}
            />
          </View>

          <View style={styles.fila}>
            <Boton
              valor="%"
              tipo="operador"
              etiqueta="Porcentaje"
              onPress={calculadora.porcentaje}
            />
            <Boton valor="0" onPress={() => calculadora.digito("0")} />
            <Boton
              valor="."
              etiqueta="Punto decimal"
              onPress={calculadora.decimal}
            />
            <Boton
              valor="="
              tipo="igual"
              etiqueta="Igual"
              onPress={calculadora.igual}
            />
          </View>
        </View>
      </View>

      <Historial
        visible={historialVisible}
        calculos={calculadora.historial}
        onCerrar={() => setHistorialVisible(false)}
        onLimpiar={calculadora.limpiarHistorial}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  seguro: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenedor: {
    flex: 1,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  titulo: {
    color: colores.texto,
    fontSize: 20,
    fontWeight: "700",
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 1,
  },
  botonHistorial: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colores.boton,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  botonHistorialPresionado: {
    opacity: 0.7,
  },
  textoHistorial: {
    color: colores.texto,
    fontSize: 14,
    fontWeight: "700",
  },
  indicadorHistorial: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colores.operador,
  },
  teclado: {
    gap: 10,
  },
  fila: {
    flexDirection: "row",
    gap: 10,
  },
});
