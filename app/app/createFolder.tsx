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
    return(
        <View>
              {visible && <View style = {styles.nameContainer}>
                <TextInput
                    style = {styles.input}
                    placeholder="Vnesite ime"
                    placeholderTextColor="gray"
                    value={name}
                    onChangeText={(newText) => setName(newText)}
                />
                <TouchableOpacity onPress={() => submit()}>
                    <Icon name="send" size={30} color="green" />
                </TouchableOpacity>
              </View>
              }

        </View>
    )
}

const styles = StyleSheet.create({
    nameContainer: {
      padding: 0,
      flex: 1,
      flexDirection: "row",
      width : "100%",
      marginLeft : 5

    },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        flex: 1, 
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    output: { marginTop: 10, fontSize: 16 },
  });

export default CreateFolder;