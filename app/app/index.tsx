import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginButton } from "./login";
import Calendar from './calendar';
import FileSystem from './fileSystem';
import { EventForm } from './eventForm';
import { WhitelistDash } from './whitelistDash';
import { EventPage } from './event_detailed';
import { RootStackParamList } from './types';
import { AuthProvider } from "./authContext";
import { AuthContext } from './authContext';
import { withAuth } from './protectedRoute';
const Stack = createStackNavigator<RootStackParamList>();

type NavBarProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

function Navbar({ navigation }: NavBarProps) {
  const logoIcon = require('./logo_fakulteta.png');
  const logoLongIcon = require('./logo_fakulteta_long.png');
  const logoSource = Platform.OS === 'web' ? logoLongIcon : logoIcon;
  const { token } = useContext(AuthContext);

  return (
    <View style={styles.container}>
    <View style={styles.navLeft}>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Calendar')}>
    <Text style={styles.label}>Koledar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Files')}>
    <Text style={styles.label}>Datoteke</Text>
    </TouchableOpacity>
            {token && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('WhitelistDash')}
          >
            <Text style={styles.label}>Administracija</Text>
          </TouchableOpacity>
        )}
    <LoginButton/>
    </View>
    <Image source={logoIcon} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

export default function Index() {
  return (
          <AuthProvider>
    <Stack.Navigator
    initialRouteName="Calendar"
    screenOptions={({ navigation }) => ({
      header: () => <Navbar navigation={navigation} />,
    })}
    >
    <Stack.Screen
    name="Calendar"
    component={Calendar}
    />
    <Stack.Screen
    name="Files"
    component={FileSystem}
    />
    <Stack.Screen
    name="EventForm"
    component={EventForm}
    />
    <Stack.Screen
    name="WhitelistDash"
    component={withAuth(WhitelistDash)}
    />
    <Stack.Screen
    name="EventPage"
    component={EventPage}
    />
    </Stack.Navigator>
        </AuthProvider>
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
