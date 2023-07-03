import { Alert, ScrollView, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../theme";
import { Card, MultiCard, NoIconHeader, MultiCardItem } from "@components";
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";
import appConfig from "../../../../app.json";
import { ProfileSettingsStackScreenProps } from "@navigation-types";
import { useAuthContext } from "@context";
import { ToastService } from "@utility";
import { styles } from "./styles";
import { screenStyles } from "src/screens/styles";

const group1 = {
  icon: require("../../../assets/images/user.png"),
  title: "",
  subtitle: "",
};

export const Settings: React.FC<ProfileSettingsStackScreenProps<"Settings">> = ({ navigation }) => {
  const appVersion = appConfig.expo.version;
  const {
    state: { user },
  } = useAuthContext();

  const multiData1: Array<MultiCardItem> = [
    {
      id: 1,
      icon: <MaterialCommunityIcons name="forklift" color={colors.heavyGray} size={25} />,
      bgColor: colors.mediumGray,
      title: "Vehicle Icons",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("VehicleIcons");
      },
    },
    {
      id: 2,
      icon: <MaterialCommunityIcons name="key" size={20} color={colors.heavyGray} />,
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
      icon: <MaterialCommunityIcons name="information" size={20} color={colors.heavyGray} />,
      bgColor: colors.mediumGray,
      title: "About",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("About");
      },
    },
    {
      id: 4,
      icon: <MaterialCommunityIcons name="help-box" size={20} color={colors.heavyGray} />,
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
      id: 6,
      icon: <MaterialIcons name="add-location-alt" color={colors.heavyGray} size={20} />,
      bgColor: colors.mediumGray,
      title: "Add POI's",
      color: colors.titleText,
      onPress: () => {
        navigation.navigate("AddPoi");
      },
    },
    {
      id: 7,
      icon: <MaterialIcons name="home-repair-service" color={colors.heavyGray} size={20} />,
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
      icon: <MaterialCommunityIcons name="file-multiple" color={colors.heavyGray} size={20} />,
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
    ToastService.show("Demo Delete!");
    // deactivateAccount(token, {
    //   _id: user?._id || "",
    // })
    //   .then((res) => {
    //     Toast.show(res?.message, { duration: 3000, animation: true });
    //     if (res.success) {
    //       logout();
    //     }
    //   })
    //   .catch((err) => {
    //     Toast.show("Error!", { duration: 3000, animation: true });
    //   })
    //   .finally(() => {});
  };

  const deactivateAlert = () => {
    Alert.alert(
      "Confirm Deactivate Account?",
      `Deactivate '${user?.name}' ?`,
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
        onDismiss: () =>
          Toast.show("Operation cancelled!", {
            animation: true,
            duration: 3000,
          }),
      }
    );
  };

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <ScrollView
        // style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <NoIconHeader title={"Profile"} />
        {/* <Text style={styles.headerText}>Profile</Text> */}
        <Card data={group1} size="large" />
        <View style={styles.segmentContainer}>
          <MultiCard data={multiData1} />
        </View>
        <View style={styles.segmentContainer}>
          <MultiCard data={multiData4} />
        </View>
        <View style={styles.segmentContainer}>
          <MultiCard data={multiData2} />
        </View>
        <View style={styles.segmentContainer}>
          <MultiCard data={multiData3} />
        </View>
        <View style={styles.segmentContainer}>
          <Text style={styles.versionText}>Version {appVersion}</Text>
        </View>
        {/* <View style={styles.segmentContainer}>
          <MultiCard data={multiData4} />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
