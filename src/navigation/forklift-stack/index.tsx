import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors, gStyles } from "@theme";
import { ForkliftStackParamsList } from "@navigation-types";
import { Forklift, AddForklift, ForkLiftDetails, RequestService } from "@screens";

const Stack = createStackNavigator<ForkliftStackParamsList>();

const ForkliftStack: React.FC = () => {
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
      initialRouteName="Forklift"
    >
      <Stack.Screen
        name="Forklift"
        component={Forklift}
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="AddForklift"
        component={AddForklift}
        options={{
          headerShown: true,
          title: "",
        }}
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

export { ForkliftStack };
