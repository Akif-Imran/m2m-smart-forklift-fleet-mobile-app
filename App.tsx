import "react-native-gesture-handler";
import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Provider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { registerRootComponent } from "expo";
import { colors } from "@theme";
import { AuthInit, AuthProvider } from "@context";
import { App } from "@";

SplashScreen.preventAutoHideAsync();

export default function RootApp() {
  const [isAppReady, setIsAppReady] = React.useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = React.useState<boolean>(false);

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

  const onLayoutRootView = React.useCallback(async () => {
    if (isAppReady && isAuthLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady, isAuthLoaded]);

  if (!isAppReady) {
    return null;
  } else {
    return (
      <RootSiblingParent>
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
                  <App />
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
