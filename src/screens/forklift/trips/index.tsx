import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { ForkliftStackScreenProps } from "@navigation-types";
import { theme } from "@theme";



const Trips: React.FC<ForkliftStackScreenProps<"Trips">> = ({}) => {
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{height:theme.header.height}}/>
      <Text style={styles.placeholder}>Trips</Text>
    </SafeAreaView>
  );
};

export { Trips };
