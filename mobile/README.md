# ALLES Mobile (Expo)

Aplicativo mobile React Native para o canal de atendimento da clínica.

## Requisitos

- Node.js 18+
- Android Studio (emulador) e/ou Xcode (iOS)

## Execução

```bash
cd mobile
npm install
npm run start
```

## Configuração de API

Por padrão o app usa:

- `http://10.0.2.2:8080/api` (Android Emulator)

Para sobrescrever:

```bash
EXPO_PUBLIC_API_URL=http://SEU_HOST:8080/api npm run start
```
