import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Button, Text, SafeAreaView, StyleSheet, Modal, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { router } from 'expo-router';


// POGLEJ SPODAJ KJE JE TREBA VPISATI SVOJ NASLOV ZA SERVER

WebBrowser.maybeCompleteAuthSession();

export const LoginButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/common/v2.0',
  );
  const redirectUri = makeRedirectUri({
    scheme: 'exp://127.0.0.1:8081',
    //preferLocalhost: true, // če ti da bluescreen na telefonu komentiraj to ven in mi pošlji tvoj expo url
    path: '/',
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
    SecureStore.getItemAsync('token').then((token:any) => {
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
              ).then(async (res:any) => {
                console.log(res);
                setToken(res.accessToken);
                const response = await fetch("http://192.168.50.170:3000/api/login", { // TUKAJ VPIŠI SVOJ NASLOV ZA SERVER
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${res.accessToken}`,
                  },
                });
                if (response.status === 200) {
                  const resJson = await response.json();
                  await Alert.alert('Status prijave', 'Uspešno ste se prijavili kot: ' + resJson.email , [
                    {text: 'OK'},
                  ]);
                } else {
                  await Alert.alert('Status prijave', 'Prijava v vaš račun ni uspela!', [
                    {text: 'OK'},
                  ]);
                }
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
  const [status, setStatus] = useState<string | null>("Logging in!");
  
  setTimeout(() => {
    (async () => {
      console.log("Checking token");
      const foundToken = await SecureStore.getItemAsync('token');
      if (foundToken) {
        console.log("Token found");
          const response = await fetch("http://192.168.50.170:3000/api/login", { // TUKAJ VPIŠI SVOJ NASLOV ZA SERVER
            method: 'GET',
            headers: {
              Authorization: `Bearer ${foundToken}`,
            },
          });
          console.log(await response.json());
          if (response.status === 200) {
            console.log("Authorized");
            setStatus("Successfully logged in!");
            setTimeout(() => {
              router.push("/");
            }, 1000);
          } else {
            setStatus("Failed to log in!");
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }
      }
      else{
        setStatus("Failed to log in!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    })();
  }
  , 1000);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <Text style={status == "Logging in!" ? styles.text: status=="Successfully logged in!" ? styles.textSuccess : styles.textFail}>{status}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text : {
    textAlign: 'center',
    fontSize: 20,
  },
  textSuccess : {
    textAlign: 'center',
    fontSize: 20,
    color: 'green',
  },
  textFail : {
    textAlign: 'center',
    fontSize: 20,
    color: 'red',
  }
});