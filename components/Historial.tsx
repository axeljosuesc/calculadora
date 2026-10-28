import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  formatearParaMostrar,
  type CalculoHistorial,
} from "../src/lib/calculadora";
import { colores } from "../src/tema/colores";

interface HistorialProps {
  visible: boolean;
  calculos: CalculoHistorial[];
  onCerrar: () => void;
  onLimpiar: () => void;
}

export default function Historial({
  visible,
  calculos,
  onCerrar,
  onLimpiar,
}: HistorialProps) {
  const vacio = calculos.length === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCerrar}
    >
      <View style={styles.contenedor}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCerrar}
          accessibilityRole="button"
          accessibilityLabel="Cerrar historial"
        />

        <View style={styles.panel} accessibilityViewIsModal>
          <View style={styles.encabezado}>
            <Text style={styles.titulo}>Historial</Text>
            <Pressable
              onPress={onCerrar}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Cerrar historial"
            >
              <Text style={styles.cerrar}>Cerrar</Text>
            </Pressable>
          </View>

          {vacio ? (
            <View style={styles.vacio}>
              <Text style={styles.vacioTitulo}>Todavía no hay operaciones</Text>
              <Text style={styles.vacioTexto}>
                Resuelve una cuenta con “=” y aparecerá aquí.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.lista}
              contentContainerStyle={styles.listaContenido}
              showsVerticalScrollIndicator={false}
            >
              {calculos.map((calculo, indice) => (
                <View
                  key={`${calculo.expresion}-${calculo.resultado}-${indice}`}
                  style={styles.item}
                >
                  <Text style={styles.itemExpresion}>
                    {calculo.expresion}
                  </Text>
                  <Text style={styles.itemResultado}>
                    {formatearParaMostrar(calculo.resultado)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          <Pressable
            onPress={onLimpiar}
            disabled={vacio}
            accessibilityRole="button"
            accessibilityLabel="Borrar historial"
            accessibilityState={{ disabled: vacio }}
            style={({ pressed }) => [
              styles.botonBorrar,
              vacio && styles.botonDeshabilitado,
              pressed && styles.botonPresionado,
            ]}
          >
            <Text style={styles.textoBorrar}>Borrar historial</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colores.superposicion,
  },
  panel: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "85%",
    backgroundColor: colores.panel,
    borderRadius: 22,
    padding: 22,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titulo: {
    color: colores.texto,
    fontSize: 24,
    fontWeight: "700",
  },
  cerrar: {
    color: colores.operador,
    fontSize: 16,
    fontWeight: "700",
  },
  lista: {
    flexShrink: 1,
  },
  listaContenido: {
    gap: 12,
    paddingVertical: 4,
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
    paddingBottom: 10,
    gap: 4,
  },
  itemExpresion: {
    color: colores.textoSuave,
    fontSize: 16,
    textAlign: "right",
  },
  itemResultado: {
    color: colores.texto,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "right",
  },
  vacio: {
    alignItems: "center",
    paddingVertical: 26,
    gap: 8,
  },
  vacioTitulo: {
    color: colores.texto,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 14,
    textAlign: "center",
  },
  botonBorrar: {
    backgroundColor: colores.acento,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  botonDeshabilitado: {
    opacity: 0.4,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  textoBorrar: {
    color: colores.textoSobreAcento,
    fontSize: 16,
    fontWeight: "700",
  },
});
