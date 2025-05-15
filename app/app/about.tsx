import { ScrollView, View, Text, StyleSheet } from "react-native";

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Navodila za uporabo</Text>
        <View style={styles.qnaContainer}>
        <Text style={styles.question}>Ali se moram prijaviti?</Text>
        <Text style={styles.answer}>
          • Prijaviti se morate če ste študent ali mentor ki želi upravljati z dogodki ali datotekami na strani. {"\n"}
          • Da se lahko prijavite morate kontaktirati mentorja ali administratorja. {"\n"}
        </Text>
        </View>

        <View style={styles.qnaContainer}>
          <Text style={styles.question}>Želim ustvariti dogodek</Text>
          <Text style={styles.answer}>
            • Na strani "Koledar" kliknite spodnji desni gumb "+".{"\n"}
            • Izpolnite informacije o dogodku.{"\n"}
            • Če želite da se dogodek tedensko ponavlja, izberite časovni okvir.{"\n"}
            • Stisnite gumb "Ustvari".{"\n"}
          </Text>
        </View>

        <View style={styles.qnaContainer}>
        <Text style={styles.question}>Želim urediti ali izbrisati dogodek</Text>
        <Text style={styles.answer}>
          • Prijavite se v stran.{"\n"}
          • Poiščite dogodek v iskalniku nad koledarjem.{"\n"}
          • Kliknite "Več" v dogodku pod koledarjem.{"\n"}
          • Kliknite "Uredi" ali "Izbriši".{"\n"}
        </Text>
        </View>

        <View style={styles.qnaContainer}>
        <Text style={styles.question}>Želim dodati datoteke k dogodku</Text>
        <Text style={styles.answer}>
          • Uredite dogodek in na enak način kot je razloženo v prejšnjem odseku in dodajte dogodke. {"\n"}
        </Text>
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
});

export default About;
