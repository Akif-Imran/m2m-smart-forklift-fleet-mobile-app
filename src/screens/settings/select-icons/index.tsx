/* eslint-disable import/extensions */
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "src/screens/styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { Button } from "react-native-paper";
import { ToastService } from "@utility";
import Spinner from "react-native-loading-spinner-overlay";
import { styles } from "./styles";
import { _ForkliftListCard } from "../components";
import { _Divider } from "@components";

const images = [
  {
    id: 1,
    src: require("@assets/images/3d-car-top-view-red.png"),
    name: "3d-car-top-view-red.png",
    size: theme.img.size.md,
  },
  {
    id: 2,
    src: require("@assets/images/3d-car-top-view-white.png"),
    name: "3d-car-top-view-white.png",
    size: theme.img.size.md,
  },
  {
    id: 3,
    src: require("@assets/images/3d-truck-top-view-blue.png"),
    name: "3d-truck-top-view-blue.png",
    size: theme.img.size.md,
  },
  {
    id: 4,
    src: require("@assets/images/forklift.png"),
    name: "forklift.png",
    size: theme.img.size.md,
  },
  {
    id: 5,
    src: require("@assets/images/bike-rider.png"),
    name: "bike-rider.png",
    size: theme.img.size.md,
  },
  {
    id: 6,
    src: require("@assets/images/marker-pin.png"),
    name: "marker-pin.png",
    size: theme.img.size.md,
  },
];

const SelectIcons: React.FC<ProfileSettingsStackScreenProps<"SelectIcon">> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState<string>("marker-pin.png");
  const [icons, _setIcons] = React.useState(images);
  console.log(selectedIcon);
  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Spinner visible={isLoading} cancelable={false} animation="fade" size="large" />
      <View style={{ height: theme.header.height }} />
      <_Divider title="Vehicle Info" />
      <_ForkliftListCard item={item} mode="info" />
      <_Divider title="Icons" />
      <View style={styles.iconsContainer}>
        {icons.map((icon) => {
          const checked = selectedIcon ? icon.name === selectedIcon : false;
          console.log(icon.name, selectedIcon, checked);
          return (
            <TouchableOpacity
              key={icon.id}
              style={StyleSheet.compose(styles.iconButton, {
                borderColor: checked ? colors.primary : colors.white,
              })}
              activeOpacity={0.7}
              onPress={() => setSelectedIcon(icon.name)}
            >
              <Image
                source={icon.src}
                style={{ width: icon.size.width, height: icon.size.height }}
                resizeMethod="auto"
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={screenStyles.formSubmitButtonContainer}>
        <Button
          theme={PaperTheme}
          mode="contained"
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              ToastService.show("icon confirmed successfully");
              navigation.goBack();
            }, 2000);
          }}
          labelStyle={StyleSheet.compose(gStyles.tblHeaderText, {
            color: colors.white,
          })}
        >
          Confirm
        </Button>
      </View>
    </SafeAreaView>
  );
};

export { SelectIcons };
