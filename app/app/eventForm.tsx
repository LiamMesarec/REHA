import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { TextInput } from "react-native-gesture-handler";
import React, {useState} from "react";
import { submitEvent } from "./api_helper";

interface FieldProps {
    title: string,
    data: string,
    onChange: (text: string) => void
}
const Field = (props: FieldProps) => {
    return(
    <View>
    <Text style={styles.label}>
        {props.title}
    </Text>
    <TextInput
    style={styles.input}
    value={props.data}
    onChangeText={props.onChange}
    />
    </View>
    );
}

export const EventForm = ({ route }) => {
    const { eventId } = route.params;
    const [TitleValue, setTitleValue] = useState(""); //set default here
    const [DescriptionValue, setDescriptionValue] = useState("");
    const [CoordinatorValue, setCoordinatorValue] = useState("");
    const [Date, setDate] = useState("2025-03-14 13:50:33");


    return(
    <View>
    <Text style = {styles.title}>Forma za dogodek: {eventId}</Text>
    <View>
        <Field title = {"Ime dogodga"} data= {TitleValue} onChange={setTitleValue}/>
        <Field title = {"Opis"} data= {DescriptionValue} onChange={setDescriptionValue}/>
        <Field title = {"Koordinator"} data= {CoordinatorValue} onChange={setCoordinatorValue}/>
        <Field title = {"Datum"} data= {Date} onChange={setDate}/>
    </View>
    <TouchableOpacity style={styles.button} onPress={() => submitEvent(TitleValue,DescriptionValue, CoordinatorValue, Date )}>Nastavi</TouchableOpacity>
    </View>
    );
};

const styles = StyleSheet.create({
    label: {
      fontSize: 18,
      marginBottom: 10,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingLeft: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15
    },
    button: {
        backgroundColor: '#24a0ed',
        fontSize: 15,
        fontWeight: 'bold',
        width: '25%',
        padding: 20,
        color: 'white'
    }
  });
  
  export default EventForm;