import { ScrollView, FlatList, View, Text, TouchableOpacity, StyleSheet  } from "react-native";
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { fetchData } from "./api_helper";

export const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DayEventProps {
    event: string;
    day: string;
    dayNum: number;
    month: string;
    year: number;
    header: boolean;
    id: number;
}

const getDayOfWeekName = (day: Date): string => {
    return days[day.getDay()];
}

export const DayEvent = (props: DayEventProps) => {
    const { event, day, dayNum, month, year } = props;
    return (
  
    <View style={styles.dayEventContainer}>
        <View style={styles.dayEventColumn}>
        
        <Text style={styles.dayT}>{day}</Text>
        <Text style={styles.dayNumT}>{dayNum}</Text>
        </View>
        <Text style={styles.eventT}>{event}</Text>
        
    </View>
    );
};

export const MonthHeader = (props: { month: string, year: number }) => {
    const { month, year } = props;
    return (
        <View style={styles.monthHeaderContainer}>
            <Text style={styles.monthHeaderT}>{year} {month}</Text>
        </View>
    );
}

const eventNames: string[] = [
    "Yoga", "Meeting", "Workshop", "Conference", "Webinar", "Training", "Seminar", "Lecture", "Class", "Session",
    "Appointment", "Gathering", "Celebration", "Party", "Festival", "Concert", "Exhibition", "Fair", "Show", "Tournament"
];

const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
}

export const getEvents = async(): Promise<DayEventProps[]> => {
    let events: DayEventProps[] = [];
    let eventsData = await fetchData("/events");
    //console.log("Fetched events data:", eventsData);
    eventsData.events.forEach((event: any) => {
      //console.log(event.start);
      let date = new Date(event.start);
        events.push({
          event: event.title,
          day: getDayOfWeekName(date),
          dayNum: date.getDate(),
          month: monthNames[date.getMonth()],
          year: date.getFullYear(),
          header: false,
          id: event.id
        });
    });
    
    return events;
};//<MonthHeader month={monthNames[dateDisplayed.getMonth() + 1]} year={dateDisplayed.getFullYear()} />

export const getMonthEvents = (month: number, year: number, events2: DayEventProps[]): DayEventProps[] => {
    let events: DayEventProps[] = [];
    events.push({
        event: "",
        day: "",
        dayNum: 0,
        month: monthNames[month],
        year: year,
        header: true,
        id: 0
    });
    let monthName = monthNames[month];
    let noEvent: boolean = true;
    for (let i = 1; i <= getDaysInMonth(year, month); i++) {
        let date:Date = new Date(year, month, i);
        noEvent = true;
        for (let j = 0; j < events2.length; j++) { // Could remove them after used and get them for each month from db
            let event = events2[j];
            if (event.year == year && event.month == monthName && event.dayNum == i) {
                events.push(event);
                noEvent = false;
                break; // PRINTS 1 EVENT PER DAY MAX
            }
        }
        if (!noEvent) continue;
        events.push({
            event: "No event",
            day: getDayOfWeekName(date),
            dayNum: i,
            month: monthName,
            year: year,
            header: false,
            id: 0
        });
    }
    return events;
};

export function Calendar() {
    let dateDisplayed: Date = new Date();
    const navigation = useNavigation();
    const [events2, setEvents2] = useState<DayEventProps[]>([]);
    useEffect(() => {
      const fetchEvents = async () => {
          const eventsData = await getEvents();
          setEvents2(eventsData);
      };

      fetchEvents();
  }, []);
  

    let events = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear(), events2);


    return (
  
      <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Files', { })}>
          <Text>
            Files
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EventForm', { eventId: null})}>
          <Text>
            Event Creation
          </Text>
        </TouchableOpacity>

        <FlatList
          data={events}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (item.header === false) {
              if (item.event !== "No event") {
                return (
                  <TouchableOpacity
                    
                    onPress={() => navigation.navigate('EventPage', { eventId: item.id })}
                  >
                    <DayEvent {...item} />
                  </TouchableOpacity>
                );
              } else {
                return <DayEvent {...item} />;
              }
            }
  
            return <MonthHeader month={item.month} year={item.year} />;
          }}
          contentContainerStyle={{ alignItems: 'center', padding: 10 }}
          onEndReached={() => {
            dateDisplayed.setMonth((dateDisplayed.getMonth() + 1));
            const newEvents = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear(), events2);
            events.push(...newEvents);
          }
          }
            /*onScroll={({ nativeEvent }) => {
              if (nativeEvent.contentOffset.y <= 0) {
                events = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
              }
            }
          }*/
        />
      </View>
  
    );
  }

const styles = StyleSheet.create({
    dayEventContainer: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    dayEventColumn: {
        flexDirection: 'column',
        width: 'auto',
        justifyContent: 'space-between'
    },
    dayT: {
        textAlign: 'left',
        fontWeight: 'bold'
    },
    dayNumT: {
        textAlign: 'left'
    },
    eventT: {
        textAlign: 'left',
        fontWeight: 'bold'
    },
    monthHeaderContainer: {
        marginBottom: 20,
        marginTop: 25
    },
    monthHeaderT: {
        fontWeight: 'bold',
        fontSize: 24
    }
});

export default {Calendar};