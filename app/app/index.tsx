import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FileList from './fileDisplay';  // The file display screen
import MapList from './mapDisplay';   // The map screen

const Stack = createStackNavigator();

export default function Index() {
  return (

      <NavigationIndependentTree>
        <Stack.Navigator initialRouteName="Map">
          <Stack.Screen name="Map" component={MapList} />
          <Stack.Screen name="Files" component={FileList} />
        </Stack.Navigator>
      </NavigationIndependentTree>
  );
}
