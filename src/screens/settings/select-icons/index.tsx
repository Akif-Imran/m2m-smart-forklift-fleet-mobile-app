/* eslint-disable camelcase */
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { PaperTheme, colors, gStyles, theme } from "@theme";
import { Button } from "react-native-paper";
import { ToastService } from "@utility";
import Spinner from "react-native-loading-spinner-overlay";
import { _Divider } from "@components";
import { mapMarkers } from "@map-markers";
import { updateVehicle } from "@services";
import { useAuthContext } from "@context";
import { useAppDispatch } from "@store";
import { updateVehicleIcon } from "@slices";

import { _ForkliftListCard } from "../components";

import { styles } from "./styles";

const SelectIcons: React.FC<ProfileSettingsStackScreenProps<"SelectIcon">> = ({
  navigation,
  route,
}) => {
  const {
    state: { token },
  } = useAuthContext();
  const { item } = route.params;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIcon, setSelectedIcon] = React.useState<string>(item.icon);
  const [icons, _setIcons] = React.useState(mapMarkers);
  console.log(selectedIcon, item.icon);

  const handleOnConfirm = () => {
    setIsLoading(true);
    updateVehicle(token, {
      ...item,
      insurance_company_contact: item?.insurance_company_contact || "na",
      mileage: item.mileage || "0",
      icon: selectedIcon,
    })
      .then((res) => {
        if (res?.message) {
          ToastService.show(res.message);
        }
        if (res.success) {
          navigation.goBack();
          dispatch(updateVehicleIcon(res.data));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
      <View style={{ height: theme.header.height }} />
      <_Divider title="Vehicle Info" />
      <_ForkliftListCard item={item} mode="info" />
      <_Divider title="Icons" />
      <View style={styles.iconsContainer}>
        {Object.values(icons).map((icon, index) => {
          const checked = selectedIcon ? icon.name === selectedIcon : false;
          console.log(icon.name, selectedIcon, checked);
          return (
            <TouchableOpacity
              key={index}
              style={StyleSheet.compose(styles.iconButton, {
                borderColor: checked ? colors.primary : colors.white,
              })}
              activeOpacity={0.7}
              onPress={() => setSelectedIcon(icon.name)}
            >
              <Image
                source={icon.icon}
                style={{
                  width: theme.img.size.sm.width,
                  height: theme.img.size.sm.height,
                }}
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
          onPress={handleOnConfirm}
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
