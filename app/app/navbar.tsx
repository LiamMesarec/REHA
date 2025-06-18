import React, { use, useContext, useState, useEffect } from 'react';
import { Image, Platform, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { LoginButton } from "./login";
import { AuthContext } from './authContext';
import { StyleSheet } from 'react-native';
import {wp, hp} from './size';
import { fetchMe } from './api_helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
export function Navbar() {
  const logoIcon = require('./logo_fakulteta.png');
  const logoLongIcon = require('./logo_fakulteta_long.png');
  const logoSource = Platform.OS === 'web' ? logoLongIcon : logoIcon;
  const { token } = useContext(AuthContext);
  const [ me, setMe ] = useState({email: "", accessLevel: ""});
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchMe().then((response) => {
        if (response ==null){
          if (Platform.OS === 'web') {
            AsyncStorage.removeItem('token')
          }
          else {
            SecureStore.deleteItemAsync('token');
          }
        }
        else 
          setMe(response);
      });
    }
  }), [token];

  return (
    <SafeAreaView style={[{ margin: 0}, Platform.OS== 'android' ? {marginBottom: -hp(5)} : {marginBottom: 0}]}>
      <ScrollView horizontal={true}>
        <View style={[styles.container, token ? { width: "100%" } : { width: wp(100) }]}>
          <View style={styles.navLeft}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/calendar')}>
              <Text style={styles.label}>Koledar</Text>
            </TouchableOpacity>

            {(token && me.accessLevel == "3") && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/fileSystem')}
              >
                <Text style={styles.label}>E-Knjižnica</Text>
              </TouchableOpacity>
            )}
            {(token && me.accessLevel >= "1" ) && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/whitelistDash')}
              >
                <Text style={styles.label}>Administracija</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={() => router.push('/about')}>
              <Text style={styles.label}>O strani</Text>
            </TouchableOpacity>
            <LoginButton />
          </View>
          <Image source={logoIcon} style={styles.logo} href="https://www.fzsv.si/" target="_blank" resizeMode="contain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 64,
    elevation: 4,
    marginBottom: 16,
  },
  navLeft: {
    flexDirection: 'row',
  },
  button: {
    marginRight: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logo: {
    width: 40,
    height: 40,
  },
});
