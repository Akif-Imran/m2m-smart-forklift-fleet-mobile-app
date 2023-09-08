import "react-native-gesture-handler";
import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import { Provider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { registerRootComponent } from "expo";
import { colors } from "@theme";
import { AuthInit, AuthProvider, TaskProvider } from "@context";
import * as Notifications from "expo-notifications";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@store";
import { _DataLoader } from "@components";

import { App } from "@";

SplashScreen.preventAutoHideAsync();

// eslint-disable-next-line import/no-default-export
export default function RootApp() {
  const [isAppReady, setIsAppReady] = React.useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = React.useState<boolean>(false);
  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();

  React.useLayoutEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          "Visby-Heavy": require("./src/assets/fonts/VisbyHeavy.otf"),
          "Visby-ExtraBold": require("./src/assets/fonts/VisbyExtrabold.otf"),
          "Visby-Bold": require("./src/assets/fonts/VisbyBold.otf"),
          "Visby-Medium": require("./src/assets/fonts/VisbyMedium.otf"),
          "Visby-Regular": require("./src/assets/fonts/VisbyRegular.otf"),
          "Visby-Semibold": require("./src/assets/fonts/VisbySemibold.otf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    };
    prepare();
  }, []);

  React.useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        //this listener is used to handle and actions that need to be performed while app in foreground
        //and you receive a push notification.
        console.log(
          "addNotificationReceivedListener",
          notification.request.content.title
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //this listener is used to handle user interaction with the notification
        console.log(
          "addNotificationResponseReceivedListener",
          response.notification.request.content.title
        );
      });

    return () => {
      if (notificationListener?.current) {
        Notifications.removeNotificationSubscription(
          notificationListener?.current
        );
      }
      if (responseListener?.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (isAppReady && isAuthLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady, isAuthLoaded]);

  if (!isAppReady && !isAuthLoaded) {
    return null;
  } else {
    return (
      <RootSiblingParent>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={colors.primary}
            style={Platform.OS === "android" ? "light" : "dark"}
          />
          {/* <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}> */}
          <NavigationContainer theme={DefaultTheme}>
            <Provider>
              <AuthProvider>
                <AuthInit setIsAuthLoaded={setIsAuthLoaded}>
                  <ReduxProvider store={store}>
                    <_DataLoader>
                      <TaskProvider>
                        <App />
                      </TaskProvider>
                    </_DataLoader>
                  </ReduxProvider>
                </AuthInit>
              </AuthProvider>
            </Provider>
          </NavigationContainer>
        </View>
      </RootSiblingParent>
    );
  }
}
registerRootComponent(RootApp);
