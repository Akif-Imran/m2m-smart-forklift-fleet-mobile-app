import React from "react";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { Login, ForgetPassword, Register } from "@screens";
import { RootTabs } from "@navigation";
import { AuthStackParamsList } from "@navigation-types";
import { colors } from "@theme";
import { useAuthContext } from "@context";

const Stack = createStackNavigator<AuthStackParamsList>();
const AuthStack = () => {
  const { isAuthorized, user } = useAuthContext();
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
            component={ForgetPassword}
            options={{ headerShown: true, headerTitle: "" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;
