import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
  Map: undefined;
  Files: undefined;
};


type MapListNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

interface MapListProps {
  navigation: MapListNavigationProp;
}

const folderNames: string[] = [
  "Mapa1",
  "Mapa2",
  "Mapa3",
];

const MapList: React.FC<MapListProps> = ({ navigation }) => {
  const [folders, setFolders] = useState<string[]>([]);

  useEffect(() => {
    setFolders(folderNames);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {folders.map((folder, index) => (
        <TouchableOpacity
          key={index}
          style={styles.fileButton}
          onPress={() => navigation.navigate('Files')}
        >
          <View style={styles.rowContainer}>
            <Icon name="folder" size={24} color="#F1C27D" />
            <Text style={styles.text}>{folder}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  fileButton: {
    backgroundColor: "#ffff00",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default MapList;