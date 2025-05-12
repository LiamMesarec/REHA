import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Navbar() {
  const nav = useNavigation();
  const logoIcon = require('./logo_fakulteta.png');

  return (
    <View style={styles.container}>
    <View style={styles.navLeft}>
    <TouchableOpacity
    style={styles.button}
    onPress={() => nav.navigate('Calendar' as any)}
    >
    <Text style={styles.label}>Calendar</Text>
    </TouchableOpacity>

    <TouchableOpacity
    style={styles.button}
    onPress={() => nav.navigate('Files' as any)}
    >
    <Text style={styles.label}>Files</Text>
    </TouchableOpacity>

    <TouchableOpacity
    style={styles.button}
    onPress={() => nav.navigate('WhitelistDash' as any)}
    >
    <Text style={styles.label}>Whitelist</Text>
    </TouchableOpacity>
    </View>

    <Image source={logoIcon} style={styles.logo} resizeMode="contain" />
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
