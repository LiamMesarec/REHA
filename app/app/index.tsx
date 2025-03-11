import { ScrollView, FlatList, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getMonthEvents, MonthHeader, DayEvent, monthNames, Calendar } from "./calendar";
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { displayEventDetails, EventPage } from "./event_detailed";
import FileDisplay from './fileDisplay';
import MapList from './mapList';
import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const fetchData = async (): Promise<any> => {
  try {
    const response = await api.get("/files");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

import { RootStackParamList } from './types';
//import { RootStackParamList } from "./types"; // Create and import this type


//const Stack = createNativeStackNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Calendar">
      <Stack.Screen name="Calendar" component={Calendar} />
      <Stack.Screen name="Files" component={FileDisplay} />

      <Stack.Screen name="EventPage" component={EventPage}>
      </Stack.Screen>

    </Stack.Navigator>
  );
}




export default function Index() {
  console.log(fetchData());
  return (
    <NavigationIndependentTree>
      <RootStack />
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    margin: 0,
    padding: 0
  }
});