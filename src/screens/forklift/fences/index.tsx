import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { NoIconHeader } from "@components";
import { ForkliftStackScreenProps } from "@navigation-types";
import { theme } from "@theme";

const Fences: React.FC<ForkliftStackScreenProps<"Fences">> = ({}) => {
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <Text style={styles.placeholder}>Fences</Text>
    </SafeAreaView>
  );
};

export { Fences };
