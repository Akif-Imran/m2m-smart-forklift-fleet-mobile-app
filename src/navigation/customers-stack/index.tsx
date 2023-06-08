import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors, gStyles } from "@theme";
import { CustomerStackParamsList } from "@navigation-types";

const Stack = createStackNavigator<CustomerStackParamsList>();

const CustomerStack: React.FC = () => {
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
      initialRouteName="CustomerList"
    >
      <Stack.Screen
        name="CustomerList"
        component={() => (
          <>
            <Text>Customer List</Text>
          </>
        )}
        options={{
          headerShown: true,
          title: "",
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

export default CustomerStack;
