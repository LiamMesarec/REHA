import { ScrollView,FlatList, View } from "react-native";
import { renderEditingTexts, getEvents, DayEvent } from "./calendar";

export default function Index() {
  const events = getEvents();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
           <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <DayEvent {...item} />}
        contentContainerStyle={{ alignItems: 'center', padding: 10 }}
      />
    </View>
  );
}