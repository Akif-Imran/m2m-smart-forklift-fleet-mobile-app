import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { DashboardStackScreenProps } from "@navigation-types";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { NoIconHeader } from "@components";

interface OwnProps {}

const Dashboard: React.FC<DashboardStackScreenProps<"Dashboard">> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader title="Dashboard" />
    </SafeAreaView>
  );
};

export { Dashboard };
