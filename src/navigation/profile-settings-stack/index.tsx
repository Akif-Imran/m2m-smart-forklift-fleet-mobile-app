import React, { FC } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors, gStyles } from "../../theme";
import { ProfileSettingsStackParamsList } from "@navigation-types";
import { About, ChangePassword, Help, Settings } from "@screens";

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
