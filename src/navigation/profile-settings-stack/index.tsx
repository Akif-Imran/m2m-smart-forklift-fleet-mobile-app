import type { FC } from "react";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import type { ProfileSettingsStackParamsList } from "@navigation-types";
import {
  About,
  ChangePassword,
  DriverWorkingTime,
  Help,
  Pois,
  SelectIcons,
  Settings,
  VehicleIcons,
  ViewPoiOnMap,
} from "@screens";

import { colors, gStyles } from "../../theme";
import { ServicesStack } from "../services-stack";
import { ReportsStack } from "../reports-stack";

const Stack = createStackNavigator<ProfileSettingsStackParamsList>();

const ProfileSettingsStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        headerTitleStyle: {
          ...gStyles.headerText,
        },
        headerTintColor: colors.titleText,
        headerTitleAlign: "center",
        headerRightContainerStyle: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          borderWidth: 0,
        },
      }}
      initialRouteName="Settings"
    >
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerTitle: "Change Password",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Pois"
        component={Pois}
        options={{
          headerTitle: "",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ViewPoiOnMap"
        component={ViewPoiOnMap}
        options={{
          headerTitle: "Map View",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="VehicleIcons"
        component={VehicleIcons}
        options={{
          headerTitle: "Vehicle Icons",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="SelectIcon"
        component={SelectIcons}
        options={{
          headerTitle: "Select Icon",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="DriverWorkingTime"
        component={DriverWorkingTime}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="ServicesStack"
        component={ServicesStack}
        options={{
          headerTitle: "Services",
        }}
      />
      <Stack.Screen
        name="ReportsStack"
        component={ReportsStack}
        options={{
          headerTitle: "Reports",
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          headerTitle: "About",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={{
          headerTitle: "Help",
          headerShown: true,
        }}
      />
      {/* <Stack.Screen
        name="DeleteAccount"
        component={}
        options={{
          headerTitle: "Add Machine",
          headerShown: true,
        }}
      /> */}
    </Stack.Navigator>
  );
};

export { ProfileSettingsStack };
