import { ScrollView, FlatList, View, Text, TouchableOpacity } from "react-native";
import { getMonthEvents, MonthHeader, DayEvent, monthNames } from "./calendar";
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, NavigationProp } from "@react-navigation/native";
//import { RootStackParamList } from "./types"; // Create and import this type


const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Calendar">
      <Stack.Screen name="Calendar" component={Calendar}/>

      <Stack.Screen name="EventPage" component={EventPage}>
     
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// {(props) =><EventPage {..props} extraData={data} />}

function Calendar() {
  let dateDisplayed:Date = new Date();
  let events = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
  const navigation = useNavigation();
  return (

    <View
      style={{
        flex: 1,
      }}
    >
           <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => { 
          if (item.header === false) {
            return (
              <TouchableOpacity style={{width: "100%",margin: 0, padding: 0}} onPress={() => navigation.navigate('EventPage')} >
                <DayEvent {...item} />
              </TouchableOpacity>
            );
          }
          
          return <MonthHeader month={item.month} year={item.year} />; 
        }}
        contentContainerStyle={{ alignItems: 'center', padding: 10 }}
        onEndReached={() => {
          dateDisplayed.setMonth((dateDisplayed.getMonth() + 1));
          const newEvents = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
          events.push(...newEvents);
        }
        /*onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y <= 0) {
            events = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
          }
        }*/
        }
      />
    </View>

  );
}


function EventPage() {
  let dateDisplayed:Date = new Date();
  const events = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
  
  return (
    <View>
      <Text>Event1</Text>
    </View>
  );
}

export default function Index() {
  return (
    <NavigationIndependentTree>
      <RootStack />
    </NavigationIndependentTree>
  );
}