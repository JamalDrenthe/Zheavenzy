# Zheavenzy Mobile App

Native mobiele app container voor [Zheavenzy](https://zheavenzy.one/) (en Vercel project deployments), gebouwd met
**Expo, React Native, TypeScript en `react-native-webview`**. De app toont de
volledige Zheavenzy muziekstreaming en artiestenplatform ervaring in een fullscreen native WebView container.

## Architectuur

- `App.tsx`: Fullscreen `WebView` met branded OLED dark startup overlay, voortgangsbalk, safe area en statusbar afhandeling.
- `app.json`: Naam `Zheavenzy`, slug `zheavenzy`, bundle identifier `one.zheavenzy.app`, donker Apple luxe thema.
- `eas.json`: EAS Build profielen (`development`, `preview`, `production`).

### URL Configuratie

De WebView laadt standaard `https://zheavenzy.one/` of de waarde van `process.env.EXPO_PUBLIC_APP_WEB_URL`.

### Domeinen & Navigatie

De app blijft naadloos binnen `zheavenzy.one`, `www.zheavenzy.one`, en de Vercel preview environments.
Externe links openen via `Linking` in de apparaatbrowser.

## Ontwikkeling & Builden

```bash
cd mobile-app
npm install
npx expo start --web
```
