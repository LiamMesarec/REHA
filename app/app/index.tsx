import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FileDisplay from './fileDisplay';  
import MapList from './mapList';  

import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();


export default function Index() {
  return (
      <NavigationIndependentTree>
        <Stack.Navigator initialRouteName="Files">
          <Stack.Screen name="Files" component={FileDisplay} />
        </Stack.Navigator>
      </NavigationIndependentTree>
  );
}
