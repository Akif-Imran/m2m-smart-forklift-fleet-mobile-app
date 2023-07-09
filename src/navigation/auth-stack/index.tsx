import React from "react";
import type { StackNavigationOptions } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, ForgotPassword, Register } from "@screens";
import type { AuthStackParamsList } from "@navigation-types";
import { colors } from "@theme";
import { useAuthContext } from "@context";

import { RootTabs } from "../bottom-tabs";

const Stack = createStackNavigator<AuthStackParamsList>();
const AuthStack = () => {
  const {
    state: { user, isAuthorized },
  } = useAuthContext();
  console.log("email issued", user?.email);
  const options: StackNavigationOptions = {
    headerShown: false,
    headerTransparent: true,
    // headerTitleStyle: {
    //   ...gStyles.headerText,
    // },
    headerTintColor: colors.titleText,
    headerTitleAlign: "center",
    headerRightContainerStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      borderWidth: 0,
    },
  };
  return (
    <Stack.Navigator screenOptions={options}>
      {isAuthorized ? (
        <>
          <Stack.Screen name="RootTabs" component={RootTabs} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgotPassword}
            options={{ headerShown: true, headerTitle: "" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export { AuthStack };
