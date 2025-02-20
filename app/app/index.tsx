import { ScrollView, View } from "react-native";
import { renderEditingTexts } from "./calendar";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 10 }}>
        {renderEditingTexts()}
      </ScrollView>
    </View>
  );
}