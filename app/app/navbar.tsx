import React, { useContext } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { LoginButton } from "./login";
import { AuthContext } from './authContext';
import { StyleSheet } from 'react-native';

import { useRouter } from "expo-router";
export function Navbar() {
  const logoIcon = require('./logo_fakulteta.png');
  const logoLongIcon = require('./logo_fakulteta_long.png');
  const logoSource = Platform.OS === 'web' ? logoLongIcon : logoIcon;
  const { token } = useContext(AuthContext);
  const router = useRouter();

  return (
    <View style={styles.container}>
    <View style={styles.navLeft}>
    <TouchableOpacity style={styles.button} onPress={() => router.push('/calendar')}>
    <Text style={styles.label}>Koledar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => router.push('/about')}>
    <Text style={styles.label}>O strani</Text>
    </TouchableOpacity>
    {token && (
      <TouchableOpacity
      style={styles.button}
      onPress={() => router.push('/fileSystem')}
      >
      <Text style={styles.label}>E-Knjižnica</Text>
      </TouchableOpacity>
    )}
            {token && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/whitelistDash')}
          >
            <Text style={styles.label}>Administracija</Text>
          </TouchableOpacity>
        )}
    <LoginButton/>
    </View>
    <Image source={logoIcon} style={styles.logo} href="https://www.fzsv.si/" target="_blank" resizeMode="contain" />
    </View>
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
