import { useState } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EventFileModal from "./modales/addEventFile";
import CreateEventModal from "./modales/createEvent";
import EditEventModal from "./modales/editEvent";
import AddFileModal from "./modales/addFile";

const About = () => {
  const [fileEventVisible, setFileEventVisible] = useState<boolean>(false);
  const [createEventVisible, setCreateEventVisible] = useState<boolean>(false);
  const [editEventVisible, setEditEventVisible] = useState<boolean>(false);
  const [fileVisible, setFileVisible] = useState<boolean>(false);
  const closeModals = () =>{
    setFileEventVisible(false)
    setCreateEventVisible(false)
    setEditEventVisible(false)
    setFileVisible(false)
  }
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <EventFileModal visible={fileEventVisible} close={closeModals}/>
      <CreateEventModal visible={createEventVisible} close={closeModals}/>
      <EditEventModal visible={editEventVisible} close={closeModals}/>
      <AddFileModal visible={fileVisible} close={closeModals}/>

      <View style={styles.container}>
        <Text style={styles.title}>Navodila za uporabo</Text>
        <View style={styles.qnaContainer}>
        <Text style={styles.question}>Ali se moram prijaviti?</Text>
        <Text style={styles.answer}>
          • Prijaviti se morate če ste študent ali mentor ki želi upravljati z e-knjižnico ali dogodki na strani. {"\n"}
          • Da se lahko prijavite morate kontaktirati mentorja ali administratorja. {"\n"}
        </Text>
        <View>
          
        </View>
        </View>

        <View style={styles.qnaContainer}>
          <Text style={styles.question}>Želim ustvariti dogodek</Text>
          <Text style={styles.answer}>
          • Prijavite se v stran z gumbom "Prijava".{"\n"}
            • Na strani "Koledar" kliknite spodnji desni gumb "+".{"\n"}
            • Izpolnite informacije o dogodku.{"\n"}
            • Če želite da se dogodek tedensko ponavlja, izberite časovni okvir.{"\n"}
            • Stisnite gumb "Ustvari".{"\n"}
          </Text>
          <TouchableOpacity style={styles.imageButton} onPress={() => {setCreateEventVisible(true)}}>
              <Icon name="image-outline" size={20} color="#34495e" />
              <Text style={styles.imageButtonText}>VEČ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.qnaContainer}>
        <Text style={styles.question}>Želim urediti ali izbrisati dogodek</Text>
        <Text style={styles.answer}>
          • Prijavite se v stran z gumbom "Prijava".{"\n"}
          • Poiščite dogodek v iskalniku nad koledarjem.{"\n"}
          • Kliknite "Več" v dogodku pod koledarjem.{"\n"}
          • Kliknite "Uredi" ali "Izbriši".{"\n"}
        </Text>
        <TouchableOpacity style={styles.imageButton} onPress={() => {setEditEventVisible(true)}}>
            <Icon name="image-outline" size={20} color="#34495e" />
            <Text style={styles.imageButtonText}>VEČ</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.qnaContainer}>
        <Text style={styles.question}>Želim dodati datoteko v e-knjižnici v dogodek</Text>
        <Text style={styles.answer}>
          • Če še ne obstaja, dodajte datoteke v e-knjižnico. {"\n"}
          • V e-knjižnici stisnite gumb "UREDI" na dnu strani. {"\n"}
          • Izberite datoteke ki jih želite dodati v dogodek in stisnite "+" na dnu strani. {"\n"}
          • Nazadnje še izberete dogodek h kateremu želite dodati datoteko. Potrdite izbiro. {"\n"}
        </Text>
        <TouchableOpacity style={styles.imageButton} onPress={() => {setFileEventVisible(true)}}>
            <Icon name="image-outline" size={20} color="#34495e" />
            <Text style={styles.imageButtonText}>VEČ</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.qnaContainer}>
        <Text style={styles.question}>Želim naložiti datoteko</Text>
        <Text style={styles.answer}>
          • Pojdite v zavihek "E-Knjižnica". {"\n"}
          • Stisnite možnost za odpiranje menija desno zgoraj. {"\n"}
          • Izberite ali želite dodati mapo ali datoteko.  {"\n"}
          • Ob dodajanju mape prosim naložite vanjo tudi datoteko. Prazne mape se namreč avtomatsko pobrišejo.  {"\n"}
        </Text>
        <TouchableOpacity style={styles.imageButton} onPress={() => {setFileVisible(true)}}>
              <Icon name="image-outline" size={20} color="#34495e" />
              <Text style={styles.imageButtonText}>VEČ</Text>
        </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingVertical: 30,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1983C5',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    paddingBottom: 20,
  },
  qnaContainer: {
    marginBottom: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
    lineHeight: 24,
  },
  answer: {
    fontSize: 18,
    color: '#34495e',
    lineHeight: 26,
    marginBottom: 15,
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    color: '#34495e',
    marginRight: 8,
  },
  listText: {
    fontSize: 18,
    color: '#34495e',
    flex: 1,
  },
  imageButton: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  borderWidth: 1,
  borderRadius: 20,
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderColor: '#34495e'
},

imageButtonText: {
  color: '#34495e',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 8,
},
});

export default About;
