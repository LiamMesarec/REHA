import { useState, useEffect, useCallback, useContext } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { TouchableOpacity, Text, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { getItem, setItem, deleteItem } from './storage';
import { AuthContext } from './authContext';

WebBrowser.maybeCompleteAuthSession();
const isWeb = Platform.OS === 'web';

export const LoginButton = () => {
  const discovery = useAutoDiscovery('https://login.microsoftonline.com/common/v2.0');
  const redirectUri = makeRedirectUri({ scheme: 'https://193.2.219.130' });
  const clientId = '254e900e-530c-4a0a-9150-93868c601b3e';
  const initialToken = isWeb
  ? window.localStorage.getItem('token')
  : null;
  //const [token, setToken] = useState<string | null>(initialToken);
  const { token, setToken } = useContext(AuthContext);
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (!isWeb) {
      getItem('token').then((t) => {
        if (t) setToken(t);
      });
    }
  }, []);

  const handleLogin = useCallback(() => {
    if (!request || !discovery) return;
    promptAsync().then((codeResponse: any) => {
      if (codeResponse.type === 'success' && request.codeVerifier) {
        exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: { code_verifier: request.codeVerifier },
            redirectUri,
          },
          discovery
        ).then(async (res: any) => {
          setToken(res.accessToken);
          await setItem('token', res.accessToken);

          const response = await fetch('https://193.2.219.130/api/login', {
            method: 'GET',
            headers: { Authorization: `Bearer ${res.accessToken}` },
          });
          if (response.ok) {
            const { email } = await response.json();
            console.log(`Uspešno ste se prijavili kot: ${email}`);
          } else {
            console.log('Prijava v vaš račun ni uspela!');
          }
        });
      }
    });
  }, [request, discovery]);

  const handleLogout = useCallback(() => {
    deleteItem('token');
    setToken(null);
  }, []);

  return (
    <SafeAreaView>
      <TouchableOpacity
        disabled={!request}
        style={styles.button}
        onPress={token ? handleLogout : handleLogin}
      >
        <Text style={styles.label}>{token ? 'Odjava' : 'Prijava'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

