import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors, gStyles } from "@theme";
import type { ServiceStackParamsList } from "@navigation-types";
import {
  Services,
  ServiceDetails,
  ForkliftNotification,
  ForkliftNotificationDetails,
} from "@screens";

const Stack = createStackNavigator<ServiceStackParamsList>();

const ServicesStack: React.FC = () => {
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
      initialRouteName="Services"
    >
      <Stack.Screen
        name="Services"
        component={Services}
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
        options={{
          headerShown: true,
          title: "Details",
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
    </Stack.Navigator>
  );
};

export { ServicesStack };
