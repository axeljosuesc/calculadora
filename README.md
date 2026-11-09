# Calculadora por voz

La calculadora acepta operaciones dictadas en español, muestra el resultado en
la pantalla, lo agrega al historial y lo lee en voz alta. Ejemplos: “dos más
dos”, “siete por ocho” y “diez dividido para dos”.

## Preparar Android

El reconocimiento de voz usa código nativo, por lo que requiere un development
build y no funciona en Expo Go. Con EAS configurado en la cuenta del proyecto,
genera un APK de desarrollo con:

```bash
npx eas-cli@latest build --profile development --platform android
```

Para generar un APK interno de prueba usa el perfil `preview`; para publicar en
Google Play usa `production` (AAB).

## Comprobaciones

```bash
npm run typecheck
npm run lint
```
