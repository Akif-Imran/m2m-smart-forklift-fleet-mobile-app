import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { NoIconHeader, _ReportCard } from "@components";
import { colors } from "@theme";
import { ReportStackScreenProps } from "@navigation-types";

interface OwnProps {}

const Reports: React.FC<ReportStackScreenProps<"Reports">> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader
        title="Reports"
        right={[
          {
            icon: <Ionicons name="notifications" size={24} color={colors.primary} />,
            onPress: () => navigation.navigate("Notification"),
          },
        ]}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <_ReportCard title="Collision Report" />
        <_ReportCard title="Forklift Report" />
        <_ReportCard title="Forklift Breakdown Report" />
        <_ReportCard title="Over Speeding Report" />
        <_ReportCard title="Driver Performance Report" />
        <_ReportCard title="Forklift Maintenance Report" />
        <_ReportCard title="Idling Report" />
        <_ReportCard title="Ignition Report" />
        <_ReportCard title="History Report" />
      </ScrollView>
    </SafeAreaView>
  );
};

export { Reports };
