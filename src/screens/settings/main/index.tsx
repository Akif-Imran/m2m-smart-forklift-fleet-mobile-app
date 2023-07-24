import { Alert, ScrollView, Text, View } from "react-native";
import React from "react";
import type { MultiCardItem } from "@components";
import { Card, MultiCard, NoIconHeader } from "@components";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { useAuthContext } from "@context";
import { ToastService } from "@utility";
import { screenStyles } from "@screen-styles";
import appConfig from "@app-config";
import { colors } from "@theme";
import { deleteAccount } from "@services";
import Spinner from "react-native-loading-spinner-overlay";

import { styles } from "./styles";

const group1 = {
  icon: require("../../../assets/images/user.png"),
  title: "",
  subtitle: "",
};

export const Settings: React.FC<
  ProfileSettingsStackScreenProps<"Settings">
> = ({ navigation }) => {
  const appVersion = appConfig.expo.version;
  const {
    state: { token, isDriver, isWarehouse, isService },
    logout,
  } = useAuthContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const filterOut: number[] = [];
  if (isDriver) {
    filterOut.push(1, 6, 8, 9);
  } else if (isWarehouse) {
    filterOut.push(1, 6);
  } else if (isService) {
    filterOut.push(1, 6, 8, 9);
  }

  const multiData1: Array<MultiCardItem> = [
    {
      id: 1,
      icon: (
        <MaterialCommunityIcons
          name="forklift"
          color={colors.heavyGray}
          size={25}
        />
      ),
      bgColor: colors.mediumGray,
      title: "Vehicle Icons",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("VehicleIcons");
      },
    },
    {
      id: 2,
      icon: (
        <MaterialCommunityIcons name="key" size={20} color={colors.heavyGray} />
      ),
      bgColor: colors.mediumGray,
      title: "Change Password",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("ChangePassword");
      },
    },
  ];

  const multiData2: Array<MultiCardItem> = [
    {
      id: 3,
      icon: (
        <MaterialCommunityIcons
          name="information"
          size={20}
          color={colors.heavyGray}
        />
      ),
      bgColor: colors.mediumGray,
      title: "About",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("About");
      },
    },
    {
      id: 4,
      icon: (
        <MaterialCommunityIcons
          name="help-box"
          size={20}
          color={colors.heavyGray}
        />
      ),
      bgColor: colors.mediumGray,
      title: "Help",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("Help");
      },
    },
  ];
  const multiData3: Array<MultiCardItem> = [
    {
      id: 5,
      icon: <FontAwesome5 name="trash" size={17} color={colors.error} />,
      bgColor: colors.thinError,
      title: "Delete Account",
      color: colors.error,
      onPress: () => deactivateAlert(),
    },
  ];

  const multiData4: Array<MultiCardItem> = [
    {
      id: 9,
      icon: <MaterialIcons name="timer" color={colors.heavyGray} size={20} />,
      bgColor: colors.mediumGray,
      title: "Driver Working Time",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("DriverWorkingTime");
      },
    },
    {
      id: 6,
      icon: (
        <MaterialIcons
          name="add-location-alt"
          color={colors.heavyGray}
          size={20}
        />
      ),
      bgColor: colors.mediumGray,
      title: "POI List",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("Pois");
      },
    },
    {
      id: 7,
      icon: (
        <MaterialIcons
          name="home-repair-service"
          color={colors.heavyGray}
          size={20}
        />
      ),
      bgColor: colors.mediumGray,
      title: "Services",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("ServicesStack", {
          screen: "Services",
        });
      },
    },
    {
      id: 8,
      icon: (
        <MaterialCommunityIcons
          name="file-multiple"
          color={colors.heavyGray}
          size={20}
        />
      ),
      bgColor: colors.mediumGray,
      title: "Reports",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("ReportsStack", {
          screen: "Reports",
        });
      },
    },
  ];

  const onDeactivateAlertOk = () => {
    setIsLoading(true);
    deleteAccount(token)
      .then((res) => {
        ToastService.show(res?.message);
        if (res.success) {
          logout();
        }
      })
      .catch((_err) => {
        ToastService.show("Error!");
        console.log(_err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deactivateAlert = () => {
    Alert.alert(
      "Confirm Delete Account?",
      "This will permanently delete all related data and cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () =>
            Toast.show("Operation cancelled!", {
              animation: true,
              duration: 3000,
            }),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: onDeactivateAlertOk,
        },
      ],
      {
        cancelable: true,
        onDismiss: () => ToastService.show("Operation cancelled!"),
      }
    );
  };

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <Spinner
        visible={isLoading}
        cancelable={false}
        animation="fade"
        size="large"
      />
      <ScrollView
        // style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <NoIconHeader title={"Profile"} />
        <Card data={group1} size="large" />
        <View style={styles.segmentContainer}>
          <MultiCard
            data={multiData1.filter((item) => !filterOut.includes(item.id))}
          />
        </View>
        <View style={styles.segmentContainer}>
          <MultiCard
            data={multiData4.filter((item) => !filterOut.includes(item.id))}
          />
        </View>
        <View style={styles.segmentContainer}>
          <MultiCard
            data={multiData2.filter((item) => !filterOut.includes(item.id))}
          />
        </View>
        <View style={styles.segmentContainer}>
          <MultiCard
            data={multiData3.filter((item) => !filterOut.includes(item.id))}
          />
        </View>
        <View style={styles.segmentContainer}>
          <Text style={styles.versionText}>Version {appVersion}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
