import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { NoIconHeader } from "@components";

interface OwnProps {}

const Forklift: React.FC<ForkliftStackScreenProps<"Forklift">> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader title="Forklifts" />
      <Text>_Component</Text>
    </SafeAreaView>
  );
};

export { Forklift };
