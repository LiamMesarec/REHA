import {
  ScrollView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchData } from "./api_helper";
import { useRouter } from "expo-router";
import AgendaItem from "./AgendaItem";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  LocaleConfig,
} from "react-native-calendars";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { SearchType } from "./eventSearch";
const leftArrowIcon = require("./previous.png");
const rightArrowIcon = require("./next.png");

LocaleConfig.locales["si"] = {
  formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
  monthNames: [
    "Januar",
    "Februar",
    "Marec",
    "April",
    "Maj",
    "Junij",
    "Julij",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ],
  monthNamesShort: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ],
  dayNames: [
    "Nedelja",
    "Ponedeljek",
    "Torek",
    "Sreda",
    "Četrtek",
    "Petek",
    "Sobota",
  ],
  dayNamesShort: ["N", "P", "T", "S", "Č", "P", "S"],
};

LocaleConfig.defaultLocale = "si";

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
  description: string;
  coordinator: string;
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

export const MonthHeader = (props: { month: string; year: number }) => {
  const { month, year } = props;
  return (
    <View style={styles.monthHeaderContainer}>
      <Text style={styles.monthHeaderT}>
        {year} {month}
      </Text>
    </View>
  );
};

export const getEvents = async (): Promise<DayEventProps[]> => {
  let events: DayEventProps[] = [];
  let eventsData = await fetchData("/events");
  //console.log(eventsData);
  eventsData.events.forEach((event: any) => {
    //console.log(event.start);
    let dateStart = new Date(event.start);
    let dateEnd = new Date(event.to_date);
    if (dateEnd === null) {
      events.push({
        event: event.title,
        time:
          dateStart.getHours().toString() +
          ":" +
          (dateStart.getMinutes().toString().length == 1 ? "0" : "") +
          dateStart.getMinutes().toString(),
        day: getDayOfWeekName(dateStart),
        dayNum: dateStart.getDate(),
        month: dateStart.getMonth(),
        year: dateStart.getFullYear(),
        header: false,
        id: event.id,
        coordinator: event.coordinator,
        description: event.description
      });
    } else {
      let date = dateStart;
      while (date <= dateEnd) {
        events.push({
          event: event.title,
          time:
            date.getHours().toString() +
            ":" +
            (date.getMinutes().toString().length == 1 ? "0" : "") +
            date.getMinutes().toString(),
          day: getDayOfWeekName(date),
          dayNum: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          header: false,
          id: event.id,
          coordinator: event.coordinator,
          description: event.description
        });
        date.setHours(date.getHours() + 24);
      }
    }
  });

  return events;
}; //<MonthHeader month={monthNames[dateDisplayed.getMonth() + 1]} year={dateDisplayed.getFullYear()} />

interface GroupedEvent {
  title: string; // YYYY-MM-DD format
  data: EventEntry[];
}

interface EventEntry {
  time: string;
  id: number;
  title: string;
  description: string;
  coordinator: string;
}

function groupEventsByDate(events: DayEventProps[]): GroupedEvent[] {
  // Create a map to group events by ISO date
  const grouped = events.reduce((acc: GroupedEvent[], event) => {
    const isoDate = `${event.year}-${String(event.month).padStart(
      2,
      "0"
    )}-${String(event.dayNum).padStart(2, "0")}`;
    const existingGroup = acc.find((g) => g.title === isoDate);

    if (existingGroup) {
      existingGroup.data.push({
        time: event.time,
        id: event.id,
        title: event.event,
        coordinator: event.coordinator,
        description: event.description
      });
    } else {
      acc.push({
        title: isoDate,
        data: [
          {
            time: event.time,
            id: event.id,
            title: event.event,
            coordinator: event.coordinator,
            description: event.description
          },
        ],
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
  return today.toISOString().split("T")[0];
}

export const themeColor = "#1983C5";
export const lightThemeColor = "#1983C5";

export function getTheme() {
  const disabledColor = "grey";

  return {
    // arrows
    arrowColor: "black",
    arrowStyle: { padding: 0 },
    // knob
    expandableKnobColor: themeColor,
    // month
    monthTextColor: "black",
    textMonthFontSize: 16,
    textMonthFontFamily: "HelveticaNeue",
    textMonthFontWeight: "bold" as const,
    // day names
    textSectionTitleColor: "black",
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: "HelveticaNeue",
    textDayHeaderFontWeight: "normal" as const,
    // dates
    dayTextColor: themeColor,
    todayTextColor: "#af0078",
    textDayFontSize: 18,
    textDayFontFamily: "HelveticaNeue",
    textDayFontWeight: "500" as const,
    textDayStyle: { marginTop: Platform.OS === "android" ? 2 : 4 },
    // selected date
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: "white",
    // disabled date
    textDisabledColor: disabledColor,
    // dot (marked date)
    dotColor: themeColor,
    selectedDotColor: "white",
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: -2 },
  };
}

export const Calendar: React.FC<{ route: any }> = ({ route }) => {
  const router = useRouter();
  let dateDisplayed: Date = new Date();
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });
  const navigation = useNavigation();
  const [events2, setEvents2] = useState<DayEventProps[]>([]);
  const [events3, setEvents3] = useState<GroupedEvent[]>([]);
  const [eventsFiltered, setEventsFiltered] = useState<GroupedEvent[]>([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(SearchType.Title);

    const dropdownItems = [
      { label: "Naslov", value: SearchType.Title },
      { label: "Koordinator", value: SearchType.Coordinator },
      { label: "Opis", value: SearchType.Description },
    ];

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await getEvents();
      setEvents3(groupEventsByDate(eventsData));
      setEventsFiltered(groupEventsByDate(eventsData));
      setEvents2(eventsData);
      //console.log(groupEventsByDate(eventsData));
    };

    fetchEvents();
  }, []);

  const findMatchingEvents = (type: SearchType) => {
    let filteredGroups = events3.map((group) => {
      let filteredData = group.data.filter((entry) => {
        switch (type) {
          case SearchType.Title:
            return entry.title.toLowerCase().includes(searchBarText.toLowerCase());
          case SearchType.Coordinator:
            return entry.coordinator.toLowerCase().includes(searchBarText.toLowerCase());
          case SearchType.Description:
            return entry.description.toLowerCase().includes(searchBarText.toLowerCase());
          default:
            return false;
        }
      });
      return { ...group, data: filteredData };
    }).filter(group => group.data.length > 0);

    setEventsFiltered(filteredGroups);
  };

  return (
    <View
      style={[styles.outerContainer, isDesktop && styles.outerContainerWeb]}
    >
      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/eventForm")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <View
        style={[styles.innerContainer, isDesktop && styles.innerContainerWeb]}
      >
        <View style={styles.search}>
              <View style={styles.searchContainer}>
                {/* ISKALNIK */}
                <TextInput
                  style={styles.searchBar}
                  placeholder="Išči Dogodek"
                  placeholderTextColor="gray"
                  value={searchBarText}
                  onChangeText={setSearchBarText}
                  onSubmitEditing={() => findMatchingEvents(value)}
                  returnKeyType="search"
                />
                {/* Ikona z povečevalnim steklom */}
                <TouchableOpacity onPress={() => findMatchingEvents(value)}>
                  <Icon name="magnify" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <DropDownPicker
              open={open}
              value={value}
              items={dropdownItems}
              setOpen={setOpen}
              setValue={setValue}
              
                />
            </View>
        <CalendarProvider
          date={getTodayDate()}
          showTodayButton
          theme={todayBtnTheme.current}
        >
          <ExpandableCalendar
            testID={"expandableCalendar"}
            calendarStyle={styles.calendar}
            theme={theme.current}
            firstDay={1}
            leftArrowImageSource={leftArrowIcon}
            rightArrowImageSource={rightArrowIcon}
            allowShadow={true}
          />
          <AgendaList
            sections={eventsFiltered}
            renderItem={renderItem}
            sectionStyle={styles.section}
          />
        </CalendarProvider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  outerContainerWeb: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
  },
  innerContainerWeb: {
    width: 800,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
  },
  section: {
    backgroundColor: "white",
    color: "grey",
    textTransform: "capitalize",
  },
  calendar: {
    elevation: 10,
  },
  dayEventContainer: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  dayEventColumn: {
    flexDirection: "column",
    width: "auto",
    justifyContent: "space-between",
  },
  dayT: {
    textAlign: "left",
    fontWeight: "bold",
  },
  dayNumT: {
    textAlign: "left",
  },
  eventT: {
    textAlign: "left",
    fontWeight: "bold",
  },
  monthHeaderContainer: {
    marginBottom: 20,
    marginTop: 25,
  },
  monthHeaderT: {
    fontWeight: "bold",
    fontSize: 24,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: themeColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 999,
  },
  addButtonText: {
    fontSize: 30,
    color: "white",
    marginBottom: 4,
  },
  eventSimpleData: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventSimpleTitle: {
    marginRight: 20,
  },
  eventSimpleContainer: {
    margin: 10,
    borderColor: "black",
    borderWidth: 2,
    width: "auto",
    padding: 5,
  },
  importantText: {
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    width: "100%",
    position: "relative",
  },
  searchBar: {
    flex: 1,
    paddingLeft: 10,
    height: "100%",
  },
  scrollView: {
    marginTop: 100,
    marginBottom: 50,
    paddingRight: 10,
  },
  search: {
    zIndex: 1000, 
    elevation: 1000
  }
});

export default Calendar;
