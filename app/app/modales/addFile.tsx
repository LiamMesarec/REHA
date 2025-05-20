import { Modal, View, Image, StyleSheet, TouchableWithoutFeedback, Text, ScrollView } from "react-native";

interface Props {
  close: () => void;
  visible: boolean;
}

const AddFileModal: React.FC<Props> = ({ close, visible }) => {
  const img1 = require('../images/Create_File1.jpg');
  const img2 = require('../images/Create_File2.jpg');
  const img3 = require('../images/Create_File3.jpg');

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={close}
    >
      <TouchableWithoutFeedback onPress={close}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.text}>1. Odprite menij za izbor akcije.</Text>
              <Image source={img1} style={styles.image} />
              <Text style={styles.text}>2. Izberite "Naloži" za nalaganje datoteke v trenutno mapo</Text>
              <Image source={img2} style={styles.image} />
              <Text style={styles.text}>3. Za ustvarjanje mape stisnite "Nova Mapa". Nato vnesite ime nove mape in potrdite.</Text>
              <Image source={img3} style={styles.image} />
              <Text style={styles.text}>OPOZORILO: Ko ustvarite mapo vanjo obvezno shranite datoteko. Prazne mape se na strežniku avtomatsko zbrišejo</Text>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddFileModal;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    maxHeight: '80%',
    maxWidth: '90%',
    width: 600,
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 500,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 15,
    alignSelf: 'center',
  },
});
