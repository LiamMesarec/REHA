import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchData } from "./api_helper";
import DropDownPicker from 'react-native-dropdown-picker';

interface EventSimpleProps {
  id: number | string;
  title: string;
  coordinator: string;
  start: string;
}

enum SearchType{
    Title,
    Coordinator,
    Description
}

const EventSimple = (props: EventSimpleProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/event_detailed?eventId=${props.id}`);
      }}
    >
      <View style={styles.eventSimpleContainer}>
        <View style={styles.eventSimpleData}>
          <Text style={styles.eventSimpleTitle}>
            Dogodek: <Text style={styles.importantText}>{props.title}</Text>
          </Text>
          <Text>Koordinator: {props.coordinator}</Text>
        </View>
        <Text>Čas začetka: {props.start}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const EventSearch = () => {
  const [searchBarText, setSearchBarText] = useState("");
  const [events, setEvents] = useState([]);
  const [matchingEventProps, setMatchingEventProps] = useState<
    EventSimpleProps[]
  >([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(SearchType.Title);
  const dropdownItems = [
    { label: "Naslov", value: SearchType.Title },
    { label: "Koordinator", value: SearchType.Coordinator },
    { label: "Opis", value: SearchType.Description },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await fetchData("/events");
      setEvents(eventsData.events);
    };

    fetchEvents();
  }, []);

  const findMatchingEvents = (type: SearchType) => {
    let matchingEvents;
    switch (type){
        case SearchType.Title:
            matchingEvents = events.filter((event) =>
                event.title.toLowerCase().includes(searchBarText.toLowerCase())
            );
            break;
        case SearchType.Coordinator:
            matchingEvents = events.filter((event) =>
                event.coordinator.toLowerCase().includes(searchBarText.toLowerCase())
            );
            break;
        case SearchType.Description:
            matchingEvents = events.filter((event) =>
                event.description.toLowerCase().includes(searchBarText.toLowerCase())
            );
            break;
        default:
            alert("Napaka, ni izbran tip iskanja");
            return;
    }



    // Remove if not needed
    matchingEvents.sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    });

    setMatchingEventProps(
      matchingEvents.map((event) => ({
        id: event.id,
        title: event.title,
        coordinator: event.coordinator,
        start: event.start,
      }))
    );
  };

  return (
    <GestureHandlerRootView>
    <View>
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
      <MatchingEvents matchingEventProps={matchingEventProps} />
    </View>
    </GestureHandlerRootView>
  );
};

interface MatchingEventsProps {
  matchingEventProps: EventSimpleProps[];
}

export const MatchingEvents = ({ matchingEventProps }: MatchingEventsProps) => {
  return (
    <ScrollView>
      {/* Prikaz najdenih */}
      {matchingEventProps.map((event) => (
        <EventSimple
          key={event.id}
          id={event.id}
          title={event.title}
          coordinator={event.coordinator}
          start={event.start}
        />
      ))}
    </ScrollView>
  );
};

export default EventSearch;

const styles = StyleSheet.create({
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
});
