import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors, gStyles } from "@theme";
import type { DriversStackParamsList } from "@navigation-types";
import {
  ForkliftNotification,
  ForkliftNotificationDetails,
  Drivers,
  AddDriver,
  DriverDetails,
  AssignForklift,
  Activity,
} from "@screens";

const Stack = createStackNavigator<DriversStackParamsList>();

const DriverStack: React.FC = () => {
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
      initialRouteName="Drivers"
    >
      <Stack.Screen
        name="Drivers"
        component={Drivers}
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="AddDriver"
        component={AddDriver}
        options={({ route }) => ({
          headerShown: true,
          title:
            route.params.mode === "add" ? "Add Forklift" : "Update Forklift",
        })}
      />
      <Stack.Screen
        name="DriverDetails"
        component={DriverDetails}
        options={{
          headerShown: true,
          title: "Details",
        }}
      />
      <Stack.Screen
        name="Activity"
        component={Activity}
        options={{
          headerShown: true,
          title: "Activity",
        }}
      />
      <Stack.Screen
        name="AssignForklift"
        component={AssignForklift}
        options={{
          headerShown: true,
          title: "Assign Forklift",
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

export { DriverStack };
