import React from "react";
import { View } from "react-native";
import FileList from "./fileDisplay"; 
import MapList from "./mapDisplay";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {//<FileList />
      }
      <MapList/>
    </View>
  );
}
