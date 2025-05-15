import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { fetchMe, fetchUsers, deleteUser, addUser } from "./api_helper";
import { hp, wp } from "./size"
import { Trash2, CirclePlus } from 'lucide-react-native';
import { add } from "lodash";
import { withAuth } from './protectedRoute';

export function WhitelistDash() {
    const [me, setMe] = useState({ "email": "", "accessLevel": 0 });
    const [users, setUsers] = useState([{ "email": "", "accessLevel": 0 }]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [accessLevel, setAccessLevel] = useState(0);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchMe();
                if (response.accessLevel != 3) {
                    router.back();
                    return;
                }
                setMe(response);
                const usersResponse = await fetchUsers();
                setUsers(usersResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }
        , []);

    const router = useRouter();
    return (
        <ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={{ height: hp(5), width: wp(80), borderColor: 'gray', borderWidth: 1, marginBottom: hp(2) }}
                            onChangeText={text => setEmail(text)}
                            value={email}
                            placeholder=""
                        />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                addUser(email, accessLevel).then((response) => {
                                    if (response?.status === 200) {
                                        Alert.alert("Uspeh", "Uporabnik uspešno dodan!");
                                        setUsers([...users, { email: email, accessLevel: accessLevel }]);
                                        setEmail("");
                                    } else {
                                        Alert.alert("Napaka", "Napaka pri dodajanju uporabnika!");
                                    }
                                })
                                setModalVisible(!modalVisible)
                                }}>
                            <Text style={styles.textStyle}>Dodaj</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={{ display: "flex", alignItems: "center", paddingTop: hp(2) }}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Študenti:</Text>
                        <View style={styles.container}>
                            {users.map((user: any, index: number) => (
                                user.accessLevel === 1 ? (
                                    <View key={index} style={styles.userEntry}>
                                        <Text style={styles.text}>{user.email}</Text>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={async () => {
                                                const response = await deleteUser(user.email);
                                                if (response?.status === 200) {
                                                    setUsers(users.filter((u: any) => u.email !== user.email));
                                                } else {
                                                    Alert.alert("Error", "Napaka pri brisanju uporabnika!");
                                                }
                                            }}
                                        >
                                            <Trash2 size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                            ))}
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setAccessLevel(1);
                                    modalVisible ? setModalVisible(false) : setModalVisible(true);
                                }}
                            >
                                <CirclePlus size={20} color="green" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mentorji:</Text>
                        <View style={styles.container}>
                            {users.map((user: any, index: number) => (
                                user.accessLevel === 2 ? (
                                    <View key={index} style={styles.userEntry}>
                                        <Text style={styles.text}>{user.email}</Text>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={async () => {
                                                const response = await deleteUser(user.email);
                                                if (response?.status === 200) {
                                                    setUsers(users.filter((u: any) => u.email !== user.email));
                                                } else {
                                                    Alert.alert("Error", "Napaka pri brisanju uporabnika!");
                                                }
                                            }}
                                        >
                                            <Trash2 size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                            ))}
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setAccessLevel(2);
                                    modalVisible ? setModalVisible(false) : setModalVisible(true);
                                }}
                            >
                                <CirclePlus size={20} color="green" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Administratorji:</Text>
                        <View style={styles.container}>
                            {users.map((user: any, index: number) => (
                                user.accessLevel === 3 ? (
                                    <View key={index} style={styles.userEntry}>
                                        <Text style={styles.text}>{user.email}</Text>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={async () => {
                                                const response = await deleteUser(user.email);
                                                if (response?.status === 200) {
                                                    setUsers(users.filter((u: any) => u.email !== user.email));
                                                } else {
                                                    Alert.alert("Error", "Napaka pri brisanju uporabnika!");
                                                }
                                            }}
                                        >
                                            <Trash2 size={20} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                            ))}
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    setAccessLevel(3);
                                    modalVisible ? setModalVisible(false) : setModalVisible(true);
                                }}
                            >
                                <CirclePlus size={20} color="green" />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        padding: 10,
        alignContent: "flex-start",
        width: wp(80),
        marginBottom: hp(1.5),
    },
    text: {
        textAlign: 'center',
        fontSize: wp(2),
    },
    deleteButton: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        width: wp(7.5),
        height: hp(3.75),
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-end"
    },
    addButton: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        width: wp(7.5),
        height: hp(3.75),
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginRight: "auto",
        marginLeft: "auto",
    },
    userEntry: {
        margin: hp(0.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
})

export default withAuth(WhitelistDash);
