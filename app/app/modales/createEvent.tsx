import React, { useState } from 'react';
import { Modal, View, Image, StyleSheet, TouchableWithoutFeedback, Text, ScrollView } from "react-native";

interface Props {
  close: () => void;
  visible: boolean;
}

const CreateEventModal: React.FC<Props> = ({ close, visible }) => {
  const [hoveredImg, setHoveredImg] = useState<number | null>(null);

  const images = [
    { id: 1, source: require('../images/Create_Event1.jpg'), text: '1. V koledarju stisnite gumb +' },
    { id: 2, source: require('../images/Create_Event2.jpg'), text: '2. Izpolnite obrazec za dogodek' },
    { id: 3, source: require('../images/Create_Event3.jpg'), text: '3. Če želite, da se dogodek tedensko ponavlja, izberite časovni okvir.' },
  ];

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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {images.map((item) => (
                <View key={item.id} style={styles.block}>
                  <Text style={styles.text}>{item.text}</Text>
                  <Image
                    source={item.source}
                    style={[
                      styles.image,
                      hoveredImg === item.id && styles.imageHovered
                    ]}
                    onMouseEnter={() => setHoveredImg(item.id)}
                    onMouseLeave={() => setHoveredImg(null)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateEventModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
    maxHeight: '90%',
    maxWidth: '90%',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
    alignSelf: 'center', 
    transition: 'transform 0.2s ease-in-out', // WEB ONLY!!!!
    },
  imageHovered: {
    transform: [{ scale: 2 }],
  },
  block: {
    marginBottom: 10,
  },
});
