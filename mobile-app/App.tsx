import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type {
  ShouldStartLoadRequest,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';

const DEFAULT_URL = 'https://zheavenzy.one/';

/**
 * The website the WebView loads. EXPO_PUBLIC_APP_WEB_URL is inlined by Expo at
 * bundle time. Anything that is not an https:// (or http:// for local dev only)
 * URL, and any localhost/preview URL in a production bundle, falls back to the
 * production default.
 */
function resolveWebUrl(): string {
  const raw = process.env.EXPO_PUBLIC_APP_WEB_URL?.trim();
  if (!raw) return DEFAULT_URL;
  try {
    const url = new URL(raw);
    const isLocal =
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname.endsWith('.replit.dev') ||
      url.hostname.endsWith('.repl.co');
    if (isLocal && !__DEV__) return DEFAULT_URL;
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && __DEV__)) {
      return DEFAULT_URL;
    }
    return url.toString();
  } catch {
    return DEFAULT_URL;
  }
}

const WEB_URL = resolveWebUrl();
const BASE_HOST = new URL(WEB_URL).hostname;

/**
 * Domains the in-app browser session is allowed to navigate to.
 * Ensures the app seamlessly works across zheavenzy.one, www.zheavenzy.one,
 * and Vercel project deployments.
 */
const ALLOWED_HOSTS = new Set<string>([
  BASE_HOST,
  'zheavenzy.one',
  'www.zheavenzy.one',
  'zheavenzy-dev.vercel.app',
  'zheavenzy.vercel.app',
]);

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'about:' || parsed.protocol === 'data:' || parsed.protocol === 'blob:') {
      return true;
    }
    if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && __DEV__)) {
      return false;
    }
    if (ALLOWED_HOSTS.has(parsed.hostname)) {
      return true;
    }
    // Allow any subdomains of cloudiaudi.cloud or vercel preview deployments
    if (parsed.hostname.endsWith('.cloudiaudi.cloud') || parsed.hostname.endsWith('.vercel.app')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function openExternal(url: string) {
  Linking.openURL(url).catch(() => {
    // No handler available (e.g. unsupported scheme) — ignore.
  });
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CloudiAudiApp />
    </SafeAreaProvider>
  );
}

function CloudiAudiApp() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Android hardware back navigates WebView history first.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  const retry = useCallback(() => {
    setFailed(false);
    setLoading(true);
    setProgress(0);
    setReloadKey((k) => k + 1);
  }, []);

  const onShouldStartLoad = useCallback((request: ShouldStartLoadRequest) => {
    const { url } = request;
    if (isAllowedUrl(url)) return true;
    // Everything else (social share links, auth providers, mailto/tel,
    // intent://, arbitrary domains) leaves the app to the device browser
    // or the matching app.
    openExternal(url);
    return false;
  }, []);

  const onOpenWindow = useCallback((event: { nativeEvent: { targetUrl: string } }) => {
    const { targetUrl } = event.nativeEvent;
    if (isAllowedUrl(targetUrl)) {
      webViewRef.current?.injectJavaScript(
        `window.location.href = ${JSON.stringify(targetUrl)}; true;`,
      );
    } else {
      openExternal(targetUrl);
    }
  }, []);

  const onNavChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  }, []);

  const onError = useCallback((event: WebViewErrorEvent) => {
    const errorUrl = event.nativeEvent.url;
    if (!errorUrl || isAllowedUrl(errorUrl)) {
      setFailed(true);
      setLoading(false);
    }
  }, []);

  const onHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    if (event.nativeEvent.statusCode >= 400) {
      setFailed(true);
      setLoading(false);
    }
  }, []);

  const logo = useMemo(() => require('./assets/icon.png'), []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.webWrap}>
        {Platform.OS === 'web' ? (
          // react-native-webview has no web implementation; on the web dev
          // preview we show the same site in a plain iframe so the layout
          // and loading state can be checked in a browser.
          <iframe
            src={WEB_URL}
            style={{ flex: 1, width: '100%', height: '100%', border: 'none', backgroundColor: '#000' }}
            onLoad={() => setLoading(false)}
          />
        ) : (
        <WebView
          key={reloadKey}
          ref={webViewRef}
          source={{ uri: WEB_URL }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mediaCapturePermissionGrantType="deny"
          setSupportMultipleWindows
          onOpenWindow={onOpenWindow}
          onShouldStartLoadWithRequest={onShouldStartLoad}
          onNavigationStateChange={onNavChange}
          onLoadStart={() => {
            setLoading(true);
            setFailed(false);
          }}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
          onLoadEnd={() => setLoading(false)}
          onError={onError}
          onHttpError={onHttpError}
          pullToRefreshEnabled
          refreshControlLightMode
          startInLoadingState={false}
          allowsBackForwardNavigationGestures
          allowsFullscreenVideo
          applicationNameForUserAgent="CloudiAudiApp/1.0"
        />
        )}

        {loading && !failed && (
          <View style={styles.progressTrack} pointerEvents="none">
            <View style={[styles.progressBar, { width: `${Math.max(progress, 0.05) * 100}%` }]} />
          </View>
        )}

        {loading && progress < 1 && !failed && (
          <View style={styles.splash} pointerEvents="none">
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.brand}>CloudiAudi</Text>
            <ActivityIndicator color="#fa233b" style={styles.spinner} />
          </View>
        )}
      </View>

      {failed && (
        <View style={styles.errorOverlay}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.errorTitle}>Geen verbinding</Text>
          <Text style={styles.errorBody}>
            CloudiAudi kan de website niet laden. Controleer je internetverbinding en probeer het
            opnieuw.
          </Text>
          <Pressable style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Opnieuw proberen</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webWrap: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1a1a1a',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#fa233b',
  },
  splash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 96,
    height: 96,
  },
  brand: {
    marginTop: 16,
    color: '#f5f5f7',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  spinner: {
    marginTop: 24,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    marginTop: 16,
    color: '#f5f5f7',
    fontSize: 20,
    fontWeight: '700',
  },
  errorBody: {
    marginTop: 8,
    color: '#a1a1a6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#fa233b',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
