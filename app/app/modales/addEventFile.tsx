import { Bold } from "lucide-react-native";
import { Modal, View, Image, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";

interface Props {
  close: () => void;
  visible: boolean;
}

const EventFileModal: React.FC<Props> = ({ close, visible }) => {
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
          <View style={styles.content}>
            <Text style= {styles.text}>1. V e-knjižnici izberite datoteke in pritisnite +</Text>
            <Image source={img1} style={styles.image} />
            <Text style= {styles.text}>2. Izberite dogodek h kateremu jih želite dodati</Text>
            <Image source={img2} style={styles.image} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EventFileModal;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // optional dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  image: {
    width: 500,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 15,
  },
text: {
  fontWeight: 'bold',  
  fontSize: 18,
  marginBottom: 20,
}
});
