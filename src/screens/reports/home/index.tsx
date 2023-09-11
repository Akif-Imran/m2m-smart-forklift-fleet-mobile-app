import { ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { NoIconHeader, _ReportCard } from "@components";
import { colors } from "@theme";
import type { ReportStackScreenProps } from "@navigation-types";

const Reports: React.FC<ReportStackScreenProps<"Reports">> = ({
  navigation,
  route,
}) => {
  const { deviceId, vehicleId } = route.params;
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <NoIconHeader
        title="Reports"
        right={[
          {
            icon: (
              <Ionicons name="notifications" size={24} color={colors.primary} />
            ),
            onPress: () => navigation.navigate("Notification"),
          },
        ]}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <_ReportCard
          title="Collision Report"
          onPress={() => navigation.navigate("CollisionReport")}
        />
        <_ReportCard
          title="Forklift Utilization Report"
          onPress={() => navigation.navigate("ForkliftUtilizationReport")}
        />
        <_ReportCard
          title="Forklift Breakdown Report"
          onPress={() => navigation.navigate("ForkliftBreakdownReport")}
        />
        <_ReportCard
          title="Over Speeding Report"
          onPress={() => navigation.navigate("OverSpeedingReport")}
        />
        <_ReportCard
          title="Driver Performance Report"
          onPress={() => navigation.navigate("DriverPerformanceReport")}
        />
        <_ReportCard
          title="Forklift Maintenance Report"
          onPress={() => navigation.navigate("ForkliftMaintenanceReport")}
        />
        <_ReportCard
          title="Idling Report"
          onPress={() => navigation.navigate("IdlingReport")}
        />
        <_ReportCard
          title="Ignition Report"
          onPress={() => navigation.navigate("IgnitionReport")}
        />
        <_ReportCard
          title="History Report"
          onPress={() =>
            navigation.navigate("HistoryReport", {
              deviceId,
              vehicleId,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export { Reports };
