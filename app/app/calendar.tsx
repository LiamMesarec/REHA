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
import React, { useEffect, useState, useCallback, useRef, useMemo, useContext } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { AuthContext } from "./authContext";
import { SearchType } from "./eventSearch";

const leftArrowIcon = require("./previous.png");
const rightArrowIcon = require("./next.png");

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
  monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  dayNames: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
  dayNamesShort: ['NED', 'PET', 'TOR', 'SRE', 'ČET', 'PET', 'SOB'],
};

LocaleConfig.defaultLocale = 'si';

export const monthNamesSi = [
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
]

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
  try {
    let eventsData = await fetchData("/events");
    if (!eventsData || !eventsData.events) {
      console.warn("No events data received");
      return [];
    }
    
    eventsData.events.forEach((event: any) => {
      let dateStart = new Date(event.start);
      let dateEnd = event.to_date ? new Date(event.to_date) : null;
      
      if (!dateEnd) {
        events.push({
          event: event.title,
          time:
            dateStart.getHours().toString().padStart(2, '0') +
            ":" +
            dateStart.getMinutes().toString().padStart(2, '0'),
          day: getDayOfWeekName(dateStart),
          dayNum: dateStart.getDate(),
          month: dateStart.getMonth(),
          year: dateStart.getFullYear(),
          header: false,
          id: event.id,
          coordinator: event.coordinator || '',
          description: event.description || ''
        });
      } else {
        let date = new Date(dateStart);
        while (date <= dateEnd) {
          events.push({
            event: event.title,
            time:
              date.getHours().toString().padStart(2, '0') +
              ":" +
              date.getMinutes().toString().padStart(2, '0'),
            day: getDayOfWeekName(date),
            dayNum: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
            header: false,
            id: event.id,
            coordinator: event.coordinator || '',
            description: event.description || ''
          });
          date.setDate(date.getDate() + 1);
        }
      }
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }

  return events;
};

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
    const isoDate = `${event.year}-${String(event.month + 1).padStart(
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
    textMonthFontFamily: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textMonthFontWeight: 'bold' as const,
    // day names
    textSectionTitleColor: 'black',
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textDayHeaderFontWeight: 'normal' as const,
    // dates
    dayTextColor: themeColor,
    todayTextColor: '#af0078',
    textDayFontSize: 18,
    textDayFontFamily: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();
  
  // State management
  const [events2, setEvents2] = useState<DayEventProps[]>([]);
  const [events3, setEvents3] = useState<GroupedEvent[]>([]);
  const [eventsFiltered, setEventsFiltered] = useState<GroupedEvent[]>([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(SearchType.Title);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarKey, setCalendarKey] = useState(0);

  // Ref for AgendaList to handle scroll failures
  const agendaListRef = useRef<any>(null);

  // Memoized values
  const theme = useMemo(() => getTheme(), []);
  const todayBtnTheme = useMemo(() => ({
    todayButtonTextColor: themeColor,
  }), []);

  const dropdownItems = useMemo(() => [
    { label: "Naslov", value: SearchType.Title },
    { label: "Koordinator", value: SearchType.Coordinator },
    { label: "Opis", value: SearchType.Description },
  ], []);

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;
  const isMobile = Platform.OS !== "web" || width < 768;

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  // Handle scroll to index failed - this is the key fix
  const onScrollToIndexFailed = useCallback((info: any) => {
    console.log('Scroll to index failed:', info);
    
    // Wait a bit for the list to render more items, then try scrolling to a safe index
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      if (agendaListRef.current) {
        // Try to scroll to the highest measured frame index or a bit beyond
        const safeIndex = Math.min(info.index, info.highestMeasuredFrameIndex + 5);
        try {
          agendaListRef.current.scrollToIndex({
            index: safeIndex,
            animated: true,
            viewPosition: 0.5, // Center the item
          });
        } catch (error) {
          console.log('Safe scroll also failed, using fallback');
          // Fallback: scroll to offset instead
          const estimatedOffset = info.averageItemLength * safeIndex;
          agendaListRef.current.scrollToOffset({
            offset: estimatedOffset,
            animated: true,
          });
        }
      }
    });
  }, []);

  // Force re-render of calendar when needed
  const forceCalendarRefresh = useCallback(() => {
    setCalendarKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsData = await getEvents();
        const groupedEvents = groupEventsByDate(eventsData);
        
        setEvents3(groupedEvents);
        setEventsFiltered(groupedEvents);
        setEvents2(eventsData);
        
        // Force calendar refresh after data loads
        setTimeout(() => {
          forceCalendarRefresh();
        }, 100);
        
      } catch (error) {
        console.error("Error in fetchEvents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const findMatchingEvents = useCallback((type: SearchType) => {
    if (!searchBarText.trim()) {
      setEventsFiltered(events3);
      return;
    }

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
  }, [events3, searchBarText]);

  // Custom header renderer with error handling
  const renderHeader = useCallback((dateArg: any) => {
    try {
      const d = dateArg instanceof Date ? dateArg : new Date(dateArg);
      
      if (isNaN(d.getTime())) {
        return null;
      }

      const month = monthNamesSi[d.getMonth()];
      const year = d.getFullYear();

      return (
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarHeaderText}>
            {`${month} ${year}`}
          </Text>
        </View>
      );
    } catch (error) {
      console.error("Error rendering header:", error);
      return null;
    }
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.outerContainer, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.outerContainer, isDesktop && styles.outerContainerWeb]}
    >
      {token && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/eventForm")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      <View
        style={[styles.innerContainer, isDesktop && styles.innerContainerWeb]}
      >
        <CalendarProvider
          key={calendarKey}
          date={getTodayDate()}
          showTodayButton
          theme={todayBtnTheme}
        >
          <View style={[
            styles.mainContent, 
            isMobile ? styles.mainContentMobile : styles.mainContentDesktop
          ]}>
            <View style={[
              styles.calendarContainer, 
              isMobile ? styles.calendarContainerMobile : styles.calendarContainerDesktop
            ]}>
              <View style={styles.calendarWrapper}>
                <ExpandableCalendar
                  renderHeader={renderHeader}
                  testID={"expandableCalendar"}
                  hideArrows={false}
                  initialPosition={ExpandableCalendar.positions.OPEN}
                  calendarStyle={styles.calendar}
                  theme={theme}
                  firstDay={1}
                  leftArrowImageSource={leftArrowIcon}
                  rightArrowImageSource={rightArrowIcon}
                  allowShadow={false}
                />
              </View>
            </View>
            
            <View style={[
              styles.rightPanel, 
              isMobile ? styles.rightPanelMobile : styles.rightPanelDesktop
            ]}>
              <View style={styles.search}>
                <View style={styles.searchBarWrapper}>
                  <Icon name="magnify" size={22} color="#888" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchBarImproved}
                    placeholder="Išči Dogodek"
                    placeholderTextColor="#888"
                    value={searchBarText}
                    onChangeText={setSearchBarText}
                    onSubmitEditing={() => findMatchingEvents(value)}
                    returnKeyType="search"
                  />
                  <TouchableOpacity onPress={() => findMatchingEvents(value)} style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>Išči</Text>
                  </TouchableOpacity>
                </View>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={dropdownItems}
                  setOpen={setOpen}
                  setValue={setValue}
                  style={styles.dropdown}
                />
              </View>
              
              <View style={[styles.agendaContainer, isMobile && styles.agendaContainerMobile]}>
                <View style={styles.agendaWrapper}>
                  <AgendaList
                    ref={agendaListRef}
                    sections={eventsFiltered}
                    renderItem={renderItem}
                    sectionStyle={styles.section}
                    onScrollToIndexFailed={onScrollToIndexFailed}
                    getItemLayout={(data, index) => ({
                      length: 42.22, // Use the average from your error message
                      offset: 42.22 * index,
                      index,
                    })}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={10}
                    removeClippedSubviews={Platform.OS === 'android'}
                  />
                </View>
              </View>
            </View>
          </View>
        </CalendarProvider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  outerContainerWeb: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    //minHeight: '100vh',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  innerContainerWeb: {
    width: "100%",
    maxWidth: "80%", // Add max width for very large screens
    backgroundColor: "transparent",
    borderRadius: 8,
    overflow: "hidden",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: "column", // Default to column for mobile-first
    gap: 15,
    padding: 10,
    ...Platform.select({
      web: {
        minHeight: 600,
        // Use media query-like approach for larger screens
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          gap: 20,
        },
      }
    })
  },
  mainContentMobile: {
    flexDirection: "column",
    gap: 5, // Smaller gap for mobile
    padding: 10,
  },
  // Add desktop-specific styles
  mainContentDesktop: {
    flexDirection: "row",
    gap: "10%",
    padding: 20,
  },
  calendarContainer: {
    width: '100%', // Full width by default for mobile-first
    //minHeight: 300,
  },
  calendarContainerMobile: {
    width: '100%',
  },
  // Add desktop-specific calendar container
  calendarContainerDesktop: {
    flex: 1,
    minWidth: 350,
    maxWidth: "40%",
  },
  // New wrapper with styling for calendar
  calendarWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  rightPanel: {
    width: '100%', // Full width by default for mobile-first
    flex: 1,
  },
  rightPanelMobile: {
    width: '100%',
    flex: 1,
  },
  // Add desktop-specific right panel
  rightPanelDesktop: {
    flex: 1,
    minWidth: 350,
  },
  calendarHeader: {
    paddingVertical: 12,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  calendarHeaderText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333"
  },
  section: {
    backgroundColor: "white",
    color: "grey",
    textTransform: "capitalize",
  },
  calendar: {
    backgroundColor: 'white',
    ...Platform.select({
      web: {
        minHeight: 350,
      }
    })
  },
  agendaContainer: {
    flex: 1,
  },
  agendaContainerMobile: {
    flex: 1,
    minHeight: 400,
  },
  // New wrapper with styling for agenda
  agendaWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
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
    elevation: 1000,
    padding: 10,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBarImproved: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: "transparent",
      }
    })
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: themeColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdown: {
    borderColor: "#ccc",
  },
});

export default Calendar;