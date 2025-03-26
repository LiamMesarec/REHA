import React, { useState, useEffect, useRef, useMemo } from "react";
import { Text, TouchableOpacity, View, Alert, StyleSheet, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
interface createProps{
    createFolder :  (name : string) => void,
    refresh : () => void;
    visible : boolean;
    setVisible : (val : boolean) => void;
}
const CreateFolder: React.FC<createProps> = ({createFolder, refresh, visible, setVisible}) =>{
    const [name, setName] = useState("");

    const submit = () =>{
        createFolder(name);
        setVisible(false);
        refresh();
    }
    const reject = () =>{
        setVisible(false);
        setName("");
    }
    return(
        <View>
              {visible && 
              <View style = {styles.nameContainer}>
                <Icon name="folder" size={40} color="#F1C27D" />
                <TextInput
                    style = {styles.input}
                    placeholder="Vnesite ime mape"
                    placeholderTextColor="gray"
                    value={name}
                    onChangeText={(newText) => setName(newText)}
                />
                <TouchableOpacity onPress={() => submit()}>
                    <Icon name="check-bold" size={30} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => reject()}>
                <Icon name="close" size={30} color="red" />
                </TouchableOpacity>
              </View>
              }

        </View>
    )
}

const styles = StyleSheet.create({
    nameContainer: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: "#ffffff",
      padding: 5,
      marginVertical: 5,
      borderRadius: 5,
      borderColor: "black",
      borderWidth: 1,
      width: "94%",
      alignItems: "flex-start", 
      marginLeft : 10,
    },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        flex: 1, 
        height: 40,
        borderColor: "gray",
        borderWidth: 0,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    output: { marginTop: 10, fontSize: 16 },
  });

export default CreateFolder;