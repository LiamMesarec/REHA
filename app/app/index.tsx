import { ScrollView,FlatList, View } from "react-native";
import { getMonthEvents, MonthHeader, DayEvent, monthNames } from "./calendar";

export default function Index() {
  let dateDisplayed:Date = new Date();
  const events = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
  
  return (
    <View
      style={{
        flex: 1,
      }}
    >
           <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => { if (item.header == false) { return <DayEvent {...item} />; } return <MonthHeader month={item.month} year={item.year} />; }}
        contentContainerStyle={{ alignItems: 'center', padding: 10 }}
        onEndReached={() => {
          dateDisplayed.setMonth((dateDisplayed.getMonth() + 1));
          const newEvents = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
          events.push(...newEvents);
        }
        /*onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y <= 0) {
            events = getMonthEvents(dateDisplayed.getMonth(), dateDisplayed.getFullYear());
          }
        }*/
        }
      />
    </View>
  );
}