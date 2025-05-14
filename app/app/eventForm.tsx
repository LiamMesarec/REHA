import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Platform, RefreshControl } from "react-native"
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import React, { useState } from "react";
import { submitEvent, fetchData, submitUpdateEvent } from "./api_helper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from "expo-router";
import FileUploadScreen from "./fileUpload";
import "react-datepicker/dist/react-datepicker.css";

interface FieldProps {
  title: string,
  data: string,
  onChange: (text: string) => void
}

const Field = (props: FieldProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        {props.title}
      </Text>
      <TextInput
        style={styles.input}
        value={props.data}
        onChangeText={props.onChange}
        placeholder={`Vnesi ${props.title.toLowerCase()}...`}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const formatDate = (dateIn: Date) => {
  return dateIn.toISOString().split('T')[0] + " " +
         dateIn.toISOString().split('T')[1].split('.')[0];
}

export const EventForm = () => {
  const { eventId } = useLocalSearchParams();
  const [TitleValue, setTitleValue] = useState("");
  const [DescriptionValue, setDescriptionValue] = useState("");
  const [CoordinatorValue, setCoordinatorValue] = useState("");
  const [Date2, setDate2] = useState("2025-03-14 13:50:33");
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [date, setDate] = useState(new Date());
  const [toDate, setToDate] = useState("2025-03-14");
  const [fromDate, setFromDate] = useState("2025-03-14");

  if (eventId && eventId !== "null") {
    React.useEffect(() => {
      const fetchEventData = async () => {
        const eventDataObject = await fetchData(`/events/${eventId}`);
        const eventData = eventDataObject.event;
        setToDate(eventData.to_date);
        setFromDate(eventData.from_date);
        setDescriptionValue(eventData.description);
        setCoordinatorValue(eventData.coordinator);
        setTitleValue(eventData.title);
        setDate(new Date(eventData.start));
      };
      
      try { fetchEventData(); } 
      catch (error) { console.warn(error); }
    }, [eventId]);
  }

  const onChange = (event: any, selectedDate: Date) => {
    setShow(false);
    setDate(selectedDate);
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  const submitFn = async () => {
    try {
      if (eventId && eventId != "null") {
        alert("Pozor", "Želiš spremeniti dogodek?", [{
          text: 'Da', onPress: async () => {
            await submitUpdateEvent(
              Array.isArray(eventId) ? eventId[0] : eventId,
              TitleValue,
              DescriptionValue,
              CoordinatorValue,
              formatDate(date),
              fromDate,
              toDate
            );
            router.push("/calendar");
          }
        }, { text: 'Ne' }]);
      } else {
        await submitEvent(
          TitleValue,
          DescriptionValue,
          CoordinatorValue,
          formatDate(date),
          fromDate,
          toDate
        );
        router.push("/calendar");
      }
    } catch (error) {
      alert("Napaka", error instanceof Error ? error.message : "Neznana napaka");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.eventTitle}>
            {eventId ? "Urejanje dogodka" : "Nov dogodek"}
          </Text>
        </View>

        <Field title="Ime dogodka" data={TitleValue} onChange={setTitleValue} />
        <Field title="Opis" data={DescriptionValue} onChange={setDescriptionValue} />
        <Field title="Koordinator" data={CoordinatorValue} onChange={setCoordinatorValue} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Časovni okvir</Text>
          <View style={styles.dateRow}>
            <Field title="Od" data={fromDate} onChange={setFromDate} />
            <Field title="Do" data={toDate} onChange={setToDate} />
          </View>

          {Platform.OS === 'web' ? (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="spinner"
              onChange={(_, selectedDate) => selectedDate && setDate(selectedDate)}
              style={styles.datePicker}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showMode('date')}
              >
                <Text style={styles.buttonText}>Izberi datum</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showMode('time')}
              >
                <Text style={styles.buttonText}>Izberi čas</Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
          onPress={submitFn}
        >
          <Text style={styles.actionButtonText}>
            {eventId ? "POSODOBI" : "USTVARI"}
          </Text>
        </TouchableOpacity>

        {eventId && eventId != "null" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Priložene datoteke</Text>
            <FileUploadScreen
              refresh={() => {}}
              currentPath="Files"
              event={Array.isArray(eventId) ? eventId[0] : eventId}
            />
          </View>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginVertical: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  dateButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  actionButton: {
    borderRadius: 12,
    padding: 18,
    marginVertical: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  datePicker: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default EventForm;
