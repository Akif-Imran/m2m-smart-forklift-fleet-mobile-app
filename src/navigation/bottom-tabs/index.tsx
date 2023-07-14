import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colors } from "@theme";
import type {
  AuthStackScreenProps,
  MainTabsParamsList,
} from "@navigation-types";
import { useAuthContext } from "@context";

import { ProfileSettingsStack } from "../profile-settings-stack"; //not imported from @navigation to avoid cycle
import { DashboardStack } from "../dashboard-stack"; //not imported from @navigation to avoid cycle
import { ForkliftStack } from "../forklift-stack";
import { DriverStack } from "../drivers-stack";

// import { ServicesStack } from "../services-stack";
// import { ReportsStack } from "../reports-stack";
import { styles } from "./styles";

const Tab = createBottomTabNavigator<MainTabsParamsList>();

const RootTabs: React.FC<AuthStackScreenProps<"RootTabs">> = ({}) => {
  const {
    state: { isDriver, isWarehouse, isAdmin },
  } = useAuthContext();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: styles.labelStyle,
        tabBarInactiveTintColor: colors.titleText,
        tabBarActiveTintColor: colors.primary,
        tabBarShowLabel: true,
        unmountOnBlur: true,
      }}
      initialRouteName="DashboardStack"
    >
      {(isAdmin || isWarehouse) && (
        <Tab.Screen
          name="DashboardStack"
          component={DashboardStack}
          options={{
            title: "Dashboard",
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
            ),
          }}
        />
      )}
      {(isAdmin || isWarehouse || isDriver) && (
        <Tab.Screen
          name="ForkliftStack"
          component={ForkliftStack}
          options={{
            title: "Forklifts",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="forklift"
                color={focused ? colors.primary : colors.titleText}
                size={25}
              />
            ),
          }}
        />
      )}
      {/* <Tab.Screen
        name="ServicesStack"
        component={ServicesStack}
        options={{
          title: "Services",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="home-repair-service"
              color={focused ? colors.primary : colors.titleText}
              size={20}
            />
          ),
        }}
      /> */}
      {(isAdmin || isWarehouse) && (
        <Tab.Screen
          name="DriversStack"
          component={DriverStack}
          options={{
            title: "Drivers",
            tabBarIcon: ({ focused }) => (
              <FontAwesome
                name="users"
                color={focused ? colors.primary : colors.titleText}
                size={20}
              />
            ),
          }}
        />
      )}
      {/* <Tab.Screen
        name="ReportsStack"
        component={ReportsStack}
        options={{
          title: "Reports",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="file-multiple"
              color={focused ? colors.primary : colors.titleText}
              size={20}
            />
          ),
        }}
      /> */}
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
