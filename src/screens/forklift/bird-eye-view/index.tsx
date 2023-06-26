import { Text, View } from "react-native";
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { theme } from "@theme";

const BirdEyeView: React.FC<ForkliftStackScreenProps<"BirdEyeView">> = ({}) => {
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <Text>BirdEyeView</Text>
    </SafeAreaView>
  );
};

export { BirdEyeView };
