import { Modal, View, Image, StyleSheet, TouchableWithoutFeedback, Text, ScrollView } from "react-native";

interface Props {
  close: () => void;
  visible: boolean;
}

const EditEventModal: React.FC<Props> = ({ close, visible }) => {
  const img1 = require('../images/Add_File_To_Event1.jpg');
  const img2 = require('../images/Add_File_To_Event2.jpg');

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
              <Text style={styles.text}>1. V e-knjižnici izberite datoteke in pritisnite +</Text>
              <Image source={img1} style={styles.image} />
              <Text style={styles.text}>2. Izberite dogodek h kateremu jih želite dodati</Text>
              <Image source={img2} style={styles.image} />
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditEventModal;
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
