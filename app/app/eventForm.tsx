import { Text, View, StyleSheet, TouchableOpacity, Alert, Button, SafeAreaView, Platform } from "react-native"
import { ScrollView, TextInput } from "react-native-gesture-handler";
import React, {useState} from "react";
import { submitEvent, fetchAndOpenFile } from "./api_helper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { createElement } from "react";
import { formToJSON } from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import alert from "./alert";
import { useLocalSearchParams } from "expo-router";

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

const formatDate = (dateIn: Date) => {
    let date: string = dateIn.toISOString().split('T')[0] + " ";
    date += dateIn.toISOString().split('T')[1].split('.')[0];
    return date;
}

export const EventForm = () => {
    const { eventId } = useLocalSearchParams();
    const [TitleValue, setTitleValue] = useState(""); //set default here
    const [DescriptionValue, setDescriptionValue] = useState("");
    const [CoordinatorValue, setCoordinatorValue] = useState("");
    const [Date2, setDate2] = useState("2025-03-14 13:50:33");
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [date, setDate] = useState(new Date());
    const [toDate, setToDate] = useState("2025-03-14 13:50:33");
    const [fromDate, setFromDate] = useState("2025-03-14 13:50:33");

    //fetchAndOpenFile("0bc784d5-8e72-4433-83da-dfcca30561e9", "presentation.pdf");

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
      };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const submitFn = async () => {
        let res;
        try{
           res = await submitEvent(TitleValue, DescriptionValue, CoordinatorValue, formatDate(date), fromDate, toDate );
           
           alert("Uspešno ustvarjen dogodek: ", TitleValue,  [
            { text: "OK", onPress: () => {} }
        ]);
        }catch (error){
            if (error == 1){
              alert("Prosim izpolni vse nujne podatke");
            }else
            alert("Napaka pri ustvarjanju dogodka");
        }
    };

    interface Props {
        value: string;
        type: string
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        
    }

    function DateTimePicker2({ value, type, onChange }: Props) {  
        return createElement('input', {
          type: type,
          value: value,
          onInput: onChange,
        })
      }

    return(
    <ScrollView>
    <Text style = {styles.title}>Forma za dogodek: {eventId}</Text>
    <View>
        <Field title = {"Ime dogodga"} data= {TitleValue} onChange={setTitleValue}/>
        <Field title = {"Opis"} data= {DescriptionValue} onChange={setDescriptionValue}/>
        <Field title = {"Koordinator"} data= {CoordinatorValue} onChange={setCoordinatorValue}/>
        <Field title = {"Od datum"} data= {fromDate} onChange={setFromDate}/>
        <Field title = {"Do datum"} data= {toDate} onChange={setToDate}/>
        
      {Platform.OS != 'web' ? (
        <SafeAreaView>
        <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
        <Text>Izbrano: {date.toLocaleString()}</Text>
    </SafeAreaView>

      ): (
        <View>

            <DatePicker
            selected={date}
            onChange={(dateIn) => dateIn && setDate(dateIn)}
            timeInputLabel="Time:"
            dateFormat="MM-dd-yyyy h:mm:ss"
            showTimeInput
            />
        
            
        </View>
        
        
      )
      }

    </View>
    <TouchableOpacity style={styles.button} onPress={submitFn}><Text>Nastavi</Text></TouchableOpacity>
    </ScrollView>
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