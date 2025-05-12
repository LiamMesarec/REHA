import {
  ScrollView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchData } from "./api_helper";
import { useRouter } from "expo-router";
import AgendaItem from "./AgendaItem";
import isEmpty from 'lodash/isEmpty';
import { get } from "lodash";
import { ExpandableCalendar, AgendaList, CalendarProvider, LocaleConfig } from 'react-native-calendars';
import React, { useEffect, useState, useCallback, useRef } from "react";;

const leftArrowIcon = require('./previous.png');
const rightArrowIcon = require('./next.png');

LocaleConfig.locales['si'] = {
  formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
  monthNames: [
    'Januar',
    'Februar',
    'Marec',
    'April',
    'Maj',
    'Junij',
    'Julij',
    'August',
    'September',
    'Oktober',
    'November',
    'December'
  ],
  monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  dayNames: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
  dayNamesShort: ['N', 'P', 'T', 'S', 'Č', 'P', 'S'],
};

LocaleConfig.defaultLocale = 'si';

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DayEventProps {
  event: string;
  time: string;
  day: string;
  dayNum: number;
  month: number;
  year: number;
  header: boolean;
  id: number;
}

export interface AgendaEvent {
  time?: string;
  title?: string;
}

export interface AgendaItem {
  title: string;
  data: AgendaEvent[];
}

const getDayOfWeekName = (day: Date): string => {
  return days[day.getDay()];
};

export const DayEvent = (props: DayEventProps) => {
  const { event, day, dayNum, time, year } = props;
  return (
    <View style={styles.dayEventContainer}>
      <View style={styles.dayEventColumn}>

        <Text style={styles.dayT}>{day}</Text>
        <Text style={styles.dayNumT}>{dayNum}</Text>
      </View>
      <Text style={styles.eventT}>{event}</Text>
      <Text>{time}</Text>
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


export const getEvents = async (): Promise<DayEventProps[]> => {
  let events: DayEventProps[] = [];
  let eventsData = await fetchData("/events");
  if (! eventsData) {
    return [];
  }
  console.log(eventsData);
  eventsData.events.forEach((event: any) => {
    //console.log(event.start);
    let dateStart = new Date(event.start);
    let dateEnd = new Date(event.to_date);
    if (dateEnd === null) {
      events.push({
        event: event.title,
        time: dateStart.getHours().toString() + ":" + (dateStart.getMinutes().toString().length == 1 ? "0" : "") + dateStart.getMinutes().toString(),
        day: getDayOfWeekName(dateStart),
        dayNum: dateStart.getDate(),
        month: dateStart.getMonth(),
        year: dateStart.getFullYear(),
        header: false,
        id: event.id
      });
    }
    else {
      let date = dateStart;
      while (date <= dateEnd) {
        events.push({
          event: event.title,
          time: date.getHours().toString() + ":" + (date.getMinutes().toString().length == 1 ? "0" : "") + date.getMinutes().toString(),
          day: getDayOfWeekName(date),
          dayNum: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          header: false,
          id: event.id
        });
        date.setHours(date.getHours() + 24);
      }
    }
  });

  return events;
};//<MonthHeader month={monthNames[dateDisplayed.getMonth() + 1]} year={dateDisplayed.getFullYear()} />

interface GroupedEvent {
  title: string;  // YYYY-MM-DD format
  data: EventEntry[];
}

interface EventEntry {
  time: string;
  id: number;
  title: string;
}

function groupEventsByDate(events: DayEventProps[]): GroupedEvent[] {
  // Create a map to group events by ISO date
  const grouped = events.reduce((acc: GroupedEvent[], event) => {
    const isoDate = `${event.year}-${String(event.month).padStart(2, '0')}-${String(event.dayNum).padStart(2, '0')}`;
    const existingGroup = acc.find(g => g.title === isoDate);

    if (existingGroup) {
      existingGroup.data.push({
        time: event.time,
        id: event.id,
        title: event.event
      });
    } else {
      acc.push({
        title: isoDate,
        data: [{
          time: event.time,
          id: event.id,
          title: event.event
        }]
      });
    }
    return acc;
  }, []);

  // Sort the grouped events by ISO date (lexicographical order works)
  grouped.sort((a, b) => a.title.localeCompare(b.title));

  return grouped;
}

function getTodayDate(): string {
  const today = new Date();
  // yyyy-mm-dd format
  return today.toISOString().split('T')[0];
}

export const themeColor = '#1983C5';
export const lightThemeColor = '#1983C5';

export function getTheme() {
  const disabledColor = 'grey';

  return {
    // arrows
    arrowColor: 'black',
    arrowStyle: { padding: 0 },
    // knob
    expandableKnobColor: themeColor,
    // month
    monthTextColor: 'black',
    textMonthFontSize: 16,
    textMonthFontFamily: 'HelveticaNeue',
    textMonthFontWeight: 'bold' as const,
    // day names
    textSectionTitleColor: 'black',
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: 'HelveticaNeue',
    textDayHeaderFontWeight: 'normal' as const,
    // dates
    dayTextColor: themeColor,
    todayTextColor: '#af0078',
    textDayFontSize: 18,
    textDayFontFamily: 'HelveticaNeue',
    textDayFontWeight: '500' as const,
    textDayStyle: { marginTop: Platform.OS === 'android' ? 2 : 4 },
    // selected date
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: 'white',
    // disabled date
    textDisabledColor: disabledColor,
    // dot (marked date)
    dotColor: themeColor,
    selectedDotColor: 'white',
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: -2 }
  };
}

export const Calendar: React.FC<{ route: any }> = ({ route }) => {
  const router = useRouter();
  let dateDisplayed: Date = new Date();
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });
  const navigation = useNavigation();
  const [events2, setEvents2] = useState<DayEventProps[]>([]);
  const [events3, setEvents3] = useState<GroupedEvent[]>([]);

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await getEvents();
      //console.log(eventsData);
      setEvents3(groupEventsByDate(eventsData));
      //console.log(events3[0].title);
      setEvents2(eventsData);
    };

    fetchEvents();
  }, []);


  return (
    <CalendarProvider
      date={getTodayDate()}
      // onDateChanged={onDateChanged}
      // onMonthChange={onMonthChange}
      showTodayButton
      // disabledOpacity={0.6}
      theme={todayBtnTheme.current}
    >
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          router.replace("/calendar"); // Replace the current route to refresh
        }}
      >
        <Text style={styles.refreshButtonText}>Osveži dogodke</Text>
      </TouchableOpacity>
      <ExpandableCalendar
        testID={"expandableCalendar"}
        // horizontal={false}
        // hideArrows
        // disablePan
        // hideKnob
        // initialPosition={ExpandableCalendar.positions.OPEN}
        calendarStyle={styles.calendar}
        // headerStyle={styles.header} // for horizontal only
        // disableWeekScroll
        theme={theme.current}
        // disableAllTouchEventsForDisabledDays
        firstDay={1}
        //markedDates={getMarkedDates().current}
        leftArrowImageSource={leftArrowIcon}
        rightArrowImageSource={rightArrowIcon}
        allowShadow={true}
      //animateScroll
      // closeOnDayPress={false}
      />
      <Text style={{fontSize:3}}></Text>
      <AgendaList
        sections={events3}
        renderItem={renderItem}
        // scrollToNextEvent
        sectionStyle={styles.section}
      // dayFormat={'yyyy-MM-d'}
      />
    </CalendarProvider>

  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    color: 'grey',
    textTransform: 'capitalize'
  },
  calendar: {
    elevation: 10,
  },
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
  },
  refreshButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default Calendar;
