import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors, gStyles } from "@theme";
import type { ReportsStackParamsList } from "@navigation-types";
import {
  CollisionReport,
  DriverPerformanceReport,
  ForkliftBreakdownReport,
  ForkliftMaintenanceReport,
  ForkliftNotification,
  ForkliftNotificationDetails,
  ForkliftUtilizationReport,
  HistoryReport,
  IdlingReport,
  IgnitionReport,
  OverSpeedingReport,
  Reports,
} from "@screens";

const Stack = createStackNavigator<ReportsStackParamsList>();

const ReportsStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitleStyle: {
          ...gStyles.headerText,
        },
        headerTintColor: colors.titleText,
        headerTitleAlign: "center",
      }}
      initialRouteName="Reports"
    >
      <Stack.Screen
        name="Reports"
        component={Reports}
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="CollisionReport"
        component={CollisionReport}
        options={{
          headerShown: true,
          title: "Collision Report",
        }}
      />
      <Stack.Screen
        name="DriverPerformanceReport"
        component={DriverPerformanceReport}
        options={{
          headerShown: true,
          title: "Driver Performance Report",
        }}
      />
      <Stack.Screen
        name="ForkliftBreakdownReport"
        component={ForkliftBreakdownReport}
        options={{
          headerShown: true,
          title: "Forklift Breakdown Report",
        }}
      />
      <Stack.Screen
        name="ForkliftMaintenanceReport"
        component={ForkliftMaintenanceReport}
        options={{
          headerShown: true,
          title: "Forklift Maintenance Report",
        }}
      />
      <Stack.Screen
        name="ForkliftUtilizationReport"
        component={ForkliftUtilizationReport}
        options={{
          headerShown: true,
          title: "Forklift Utilization Report",
        }}
      />
      <Stack.Screen
        name="OverSpeedingReport"
        component={OverSpeedingReport}
        options={{
          headerShown: true,
          title: "Over Speeding Report",
        }}
      />
      <Stack.Screen
        name="IdlingReport"
        component={IdlingReport}
        options={{
          headerShown: true,
          title: "Idling Report",
        }}
      />
      <Stack.Screen
        name="IgnitionReport"
        component={IgnitionReport}
        options={{
          headerShown: true,
          title: "Ignition Report",
        }}
      />
      <Stack.Screen
        name="HistoryReport"
        component={HistoryReport}
        options={{
          headerShown: true,
          title: "History Report",
        }}
      />
      <Stack.Screen
        name="Notification"
        component={ForkliftNotification}
        options={{
          headerShown: true,
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="NotificationDetails"
        component={ForkliftNotificationDetails}
        options={{
          headerShown: true,
          title: "Details",
        }}
      />
      {/* <Stack.Screen
        name="OperatorDetails"
        component={OperatorDetails}
        options={{
          headerTitle: "Operator Details",
          headerRightContainerStyle: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            borderWidth: 0,
          },
        }}
      /> */}
    </Stack.Navigator>
  );
};

export { ReportsStack };
