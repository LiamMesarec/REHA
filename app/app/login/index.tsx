import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Button, Text, SafeAreaView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';


WebBrowser.maybeCompleteAuthSession();


// to bo na backendu za preverjanje ujemanja tokena
const getDataFomToken = async () => {
  const token = await SecureStore.getItemAsync('token');
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export const LoginButton = () => {
  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/common/v2.0',
  );
  const redirectUri = makeRedirectUri({
    scheme: undefined,
    path: 'login',
  });
  const clientId = '21bd0147-4d70-40b6-b482-8f63a0cb6e44';

  const [token, setToken] = useState<string | null>(null);

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      if (token) {
        setToken(token);
      }
    });
  }, []);

  return (
    <SafeAreaView>
      {token === null ? (
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync().then((codeResponse:any) => {
            if (request && codeResponse?.type === 'success' && discovery) {
              exchangeCodeAsync(
                {
                  clientId,
                  code: codeResponse.params.code,
                  extraParams: request.codeVerifier
                    ? { code_verifier: request.codeVerifier }
                    : undefined,
                  redirectUri,
                },
                discovery,
              ).then((res:any) => {
                console.log(res);
                setToken(res.accessToken);
                SecureStore.setItemAsync('token', res.accessToken);
              });
            }
          });
        }}
      />
      ): 
      <Button
        disabled={!request}
        title="Logout"
        onPress={() => {
          SecureStore.deleteItemAsync('token');
          setToken(null);
        }}
      />}
    </SafeAreaView>
  );
}


export default function Login() {

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      if (token) {
        setToken(token);
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <LoginButton />
      <Text>{token}</Text>
    </SafeAreaView>
  );
}