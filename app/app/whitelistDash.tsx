import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { fetchMe, fetchUsers, deleteUser } from "./api_helper";
import { hp, wp } from "./size"
import { Trash2 } from 'lucide-react-native';

export function WhitelistDash() {
    const [me, setMe] = useState({ "email": "", "accessLevel": 0 });
    const [users, setUsers] = useState([{ "email": "", "accessLevel": 0 }]);
    const [loading, setLoading] = useState(true);

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
        fontSize: wp(4),
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
    userEntry: {
        margin: hp(0.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default WhitelistDash;