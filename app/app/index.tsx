
import Calendar from "./calendar";
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {EventPage} from "./event_detailed";
import FileSystem from './fileSystem'; 
import { EventForm } from "./eventForm"; 
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import EventSearch from "./eventSearch"
import { Text, TouchableOpacity, View, Alert, StyleSheet, ScrollView, TextInput, Button } from "react-native";
import { RootStackParamList } from './types';
//import { RootStackParamList } from "./types"; // Create and import this type


//const Stack = createNativeStackNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Calendar">
      <Stack.Screen name="Calendar" component={Calendar} />
      <Stack.Screen name="Files" component={FileSystem} />
      <Stack.Screen name ="EventForm" component={EventForm}/>
      <Stack.Screen name="EventPage" component={EventPage}>
      </Stack.Screen>

    </Stack.Navigator>
  );
}

const HomePage: React.FC = () => {
  const router = useRouter();
  return(
      <View>
          <Text style={{ fontSize: 24 }}>Home Screen</Text>
          <Button title="FILES" onPress={() => router.push("/fileSystem")} />
          <Button title="CALENDAR" onPress={() => router.push("/calendar")} />
          <Button title="EVENT FORM" onPress={() => router.push("/eventForm")} />
          <Button title="SEARCH EVENTS" onPress={() => router.push("/eventSearch")} />
          <Button title="SEARCH EVENTS" onPress={() => router.push("./login")} />
          <Button
        title="Logout"
        onPress={() => {
          SecureStore.deleteItemAsync('token');
        }}
      />
          </View>
  )
}


export default function Index() {
  //console.log(fetchData("/files"));
  return (
    <HomePage/>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    margin: 0,
    padding: 0
  }
});