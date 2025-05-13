import isEmpty from "lodash/isEmpty";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import { useRouter } from "expo-router";

interface ItemProps {
  item: any;
}

const AgendaItem = (props: ItemProps) => {
  const router = useRouter();
  const { item } = props;

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.item}>
        <Text style={styles.itemHourText}>{item.time}</Text>
        <Text style={styles.itemTitleText}>{item.title}</Text>
        <View style={styles.itemButtonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => router.push(`/event_detailed?eventId=${item.id}`)}
          >
            <Text style={styles.buttonText}>Več</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemHourText: {
    width: 55, // fixed column for time
    fontSize: 14,
    color: "#555",
  },
  itemTitleText: {
    flex: 1, // take remaining space
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  itemButtonContainer: {
    width: 100, // reserve space for button
    alignItems: "flex-end",
  },
  buttonWrapper: {
    width: "100%", // fill container
    height: 36, // native Button height
    backgroundColor: "#1983C5",
    borderRadius: 4,
    overflow: "hidden", // clip Android ripple
    justifyContent: "center",
  },
  emptyItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  emptyItemText: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#1983C5", // solid blue
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    // optional shadow for depth:
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
