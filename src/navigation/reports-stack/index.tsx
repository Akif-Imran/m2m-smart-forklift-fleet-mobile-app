import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors, gStyles } from "@theme";
import { ReportsStackParamsList, ServiceStackParamsList } from "@navigation-types";
import {
  Forklift,
  AddForklift,
  ForkLiftDetails,
  RequestService,
  BirdEyeView,
  ForkliftNotification,
  ForkliftNotificationDetails,
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
      {/* <Stack.Screen
        name="AddForklift"
        component={AddForklift}
        options={({ route }) => ({
          headerShown: true,
          title: route.params.mode === "add" ? "Add Forklift" : "Update Forklift",
        })}
      />
      <Stack.Screen
        name="ForkLiftDetails"
        component={ForkLiftDetails}
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="ReqService"
        component={RequestService}
        options={{
          headerShown: true,
          title: "Request Service",
        }}
      />
      <Stack.Screen
        name="BirdEyeView"
        component={BirdEyeView}
        options={{
          headerShown: true,
          title: "Bird's Eye View",
        }}
      /> */}
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
