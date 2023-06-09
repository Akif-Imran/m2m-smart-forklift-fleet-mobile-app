import React from "react";
import { StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import { colors } from "@theme";
import { ProfileSettingsStack } from "../profile-settings-stack"; //not imported from @navigation to avoid cycle
import { CustomerStack } from "../customers-stack"; //not imported from @navigation to avoid cycle
import { MainTabsParamsList } from "@navigation-types";
import { styles } from "./styles";

const Tab = createBottomTabNavigator<MainTabsParamsList>();

interface OwnProps {}

const RootTabs: React.FC<OwnProps> = ({}) => {
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
        tabBarLabelStyle: styles.labelStyle,
        tabBarInactiveTintColor: colors.titleText,
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: true,
        unmountOnBlur: true,
      })}
      initialRouteName="CustomerStack"
    >
      <Tab.Screen
        name="CustomerStack"
        component={CustomerStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/dashboard.png")}
              style={{
                height: 18,
                width: 18,
                tintColor: focused ? colors.primary : colors.titleText,
              }}
              resizeMode="contain"
            />
            // <SimpleLineIcons name="screen-smartphone" color={focused ? colors.primary : colors.titleText} size={20} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Machines"
        component={MachinesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/engineering.png")}
              style={{
                height: 23,
                width: 23,
                tintColor: focused ? colors.primary : colors.titleText,
              }}
              resizeMode="contain"
            />
          ),
        }}
      /> */}
      {/* <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home-repair-service"
              color={focused ? colors.primary : colors.titleText}
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        name={"Operators"}
        component={OperatorStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="users"
              color={focused ? colors.primary : colors.titleText}
              size={20}
            />
          ),
          title: isAdmin ? "Users" : "Operators",
        }}
      /> */}
      <Tab.Screen
        name="ProfileSettingsStack"
        component={ProfileSettingsStack}
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="settings"
              color={focused ? colors.primary : colors.titleText}
              size={20}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export { RootTabs };
