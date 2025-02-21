import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FileList from './fileDisplay';  // The file display screen
import MapList from './mapDisplay';   // The map screen

import { RootStackParamList } from './types';  // Import the types file

const Stack = createStackNavigator<RootStackParamList>();


export default function Index() {
  return (

      <NavigationIndependentTree>
        <Stack.Navigator initialRouteName="Files">
          <Stack.Screen name="Files" component={FileList} />
        </Stack.Navigator>
      </NavigationIndependentTree>
  );
}
