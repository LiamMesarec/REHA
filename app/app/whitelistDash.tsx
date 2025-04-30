import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchMe, fetchUsers } from "./api_helper";
import { hp, wp } from "./size"

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
                console.log(usersResponse);
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
        <View style={{ display: "flex", alignItems: "center", paddingTop: hp(2) }}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <Text>Welcome, {me.email}</Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Študenti:</Text>
                    <View style={styles.container}>
                        {users.map((user: any, index: number) => (
                            user.accessLevel === 1 ? (
                                <View key={index} style={{ margin: hp(0.5) }}>
                                    <Text>{user.email}</Text>
                                    <Text>Access Level: {user.accessLevel}</Text>
                                </View>
                            ) : null
                        ))}
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Mentorji:</Text>
                    <View style={styles.container}>
                        {users.map((user: any, index: number) => (
                            user.accessLevel === 2 ? (
                                <View key={index} style={{ margin: hp(0.5) }}>
                                    <Text>{user.email}</Text>
                                    <Text>Access Level: {user.accessLevel}</Text>
                                </View>
                            ) : null
                        ))}
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Administratorji:</Text>
                    <View style={styles.container}>
                        {users.map((user: any, index: number) => (
                            user.accessLevel === 3 ? (
                                <View key={index} style={{ margin: hp(0.5) }}>
                                    <Text>{user.email}</Text>
                                    <Text>Access Level: {user.accessLevel}</Text>
                                </View>
                            ) : null
                        ))}
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: hp(2),
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        padding: 10,
        alignContent: "flex-start",
        width: wp(80),
    }
})

export default WhitelistDash;