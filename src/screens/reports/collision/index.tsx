import { Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { theme } from "@theme";

interface OwnProps {}

const CollisionReport: React.FC<OwnProps> = ({}) => {
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <View style={{ height: theme.header.height }} />
      <Text style={styles.placeholder}>CollisionReport</Text>
    </SafeAreaView>
  );
};

export { CollisionReport };
