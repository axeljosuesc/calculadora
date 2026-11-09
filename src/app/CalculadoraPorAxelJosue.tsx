import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";

import Boton from "../../components/Boton";
import Historial from "../../components/Historial";
import Pantalla from "../../components/Pantalla";
import { useCalculadora } from "../hooks/useCalculadora";
import { colores } from "../tema/colores";
import { calcular, formatear } from "../lib/calculadora";
import { interpretarOperacionVoz } from "../lib/interpreteVoz";

export default function CalculadoraPorAxelJosue() {
  const [historialVisible, setHistorialVisible] = useState(false);
  const [reconociendo, setReconociendo] = useState(false);
  const [estadoVoz, setEstadoVoz] = useState("Toca el micrófono y dicta una operación");
  const calculadora = useCalculadora({ atajosDeTeclado: !historialVisible });
  const { operacionVoz } = calculadora;

  const procesarTranscripcion = useCallback((texto: string) => {
    const operacion = interpretarOperacionVoz(texto);
    if (!operacion) {
      setEstadoVoz(`No entendí “${texto}”. Prueba: dos más dos.`);
      return;
    }

    const resultado = calcular(
      operacion.primerNumero,
      operacion.segundoNumero,
      operacion.operador,
    );
    operacionVoz(
      operacion.primerNumero,
      operacion.operador,
      operacion.segundoNumero,
    );

    if (resultado.ok) {
      const valor = formatear(resultado.valor);
      setEstadoVoz(`Resultado: ${valor}`);
      Speech.stop();
      Speech.speak(`El resultado es ${valor}`, { language: "es-ES", rate: 0.95 });
    } else {
      setEstadoVoz(resultado.mensaje);
      Speech.stop();
      Speech.speak(resultado.mensaje, { language: "es-ES", rate: 0.95 });
    }
  }, [operacionVoz]);

  useSpeechRecognitionEvent("start", () => {
    setReconociendo(true);
    setEstadoVoz("Te escucho…");
  });
  useSpeechRecognitionEvent("end", () => setReconociendo(false));
  useSpeechRecognitionEvent("result", (evento) => {
    const texto = evento.results[0]?.transcript?.trim();
    if (texto && evento.isFinal) procesarTranscripcion(texto);
  });
  useSpeechRecognitionEvent("error", (evento) => {
    setReconociendo(false);
    setEstadoVoz(evento.error === "not-allowed"
      ? "Permite el acceso al micrófono para usar la voz."
      : "No se pudo reconocer la voz. Inténtalo otra vez.");
  });

  const alternarVoz = async () => {
    if (reconociendo) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    try {
      const permiso = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permiso.granted) {
        setEstadoVoz("Permite el acceso al micrófono para usar la voz.");
        return;
      }
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        setEstadoVoz("El reconocimiento de voz no está disponible en este dispositivo.");
        return;
      }
      ExpoSpeechRecognitionModule.start({ lang: "es-EC", interimResults: true, continuous: false });
    } catch {
      setEstadoVoz("No se pudo iniciar el micrófono. Inténtalo otra vez.");
    }
  };

  return (
    <SafeAreaView style={styles.seguro} edges={["top", "bottom"]}>
      <View style={styles.contenedor}>
        <View style={styles.encabezado}>
          <View>
            <Text style={styles.titulo}>Calculadora</Text>
            <Text style={styles.subtitulo}>Básica</Text>
          </View>

          <View style={styles.accionesEncabezado}>
            <Pressable
              onPress={alternarVoz}
              accessibilityRole="button"
              accessibilityLabel={reconociendo ? "Detener dictado" : "Dictar operación por voz"}
              style={({ pressed }) => [styles.botonVoz, reconociendo && styles.botonVozActivo, pressed && styles.botonHistorialPresionado]}
            >
              <Text style={styles.textoVoz}>{reconociendo ? "■ Detener" : "🎙 Voz"}</Text>
            </Pressable>
            <Pressable
              onPress={() => setHistorialVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Abrir historial de operaciones"
              style={({ pressed }) => [styles.botonHistorial, pressed && styles.botonHistorialPresionado]}
            >
              <Text style={styles.textoHistorial}>Historial</Text>
              {calculadora.historial.length > 0 && <View style={styles.indicadorHistorial} />}
            </Pressable>
          </View>
        </View>

        <Text accessibilityLiveRegion="polite" style={styles.estadoVoz}>{estadoVoz}</Text>

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
  accionesEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  botonVoz: {
    backgroundColor: colores.boton,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  botonVozActivo: {
    backgroundColor: colores.acento,
  },
  textoVoz: {
    color: colores.texto,
    fontSize: 14,
    fontWeight: "700",
  },
  estadoVoz: {
    color: colores.textoSuave,
    fontSize: 12,
    textAlign: "center",
    minHeight: 18,
    marginBottom: 6,
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
