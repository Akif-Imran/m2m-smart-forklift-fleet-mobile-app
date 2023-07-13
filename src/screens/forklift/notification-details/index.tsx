import { Text, View } from "react-native";
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import { FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12 } from "@utility";

const ForkliftNotificationDetails: React.FC<
  ForkliftStackScreenProps<"NotificationDetails">
> = ({ route }) => {
  const { item } = route.params;

  return (
    <SafeAreaView style={screenStyles.mainContainer}>
      <_ScrollFormLayout>
        <_DefaultCard>
          <View>
            <Text style={screenStyles.detailsCardHeadingText}>
              Notification Info
            </Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Forklift</Text>
            <Text style={screenStyles.tblDescText}>{item.title}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Description</Text>
            <Text style={screenStyles.tblDescText}>{item.body}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>IMEI</Text>
            <Text style={screenStyles.tblDescText}>{item.IMEI}</Text>
          </View>
          {/* <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Driver</Text>
            <Text style={screenStyles.tblDescText}>{item.driver}</Text>
          </View> */}
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Date/Time</Text>
            <Text style={screenStyles.tblDescText}>
              {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12(item.createdAt)}
            </Text>
          </View>
          {/* <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Description</Text>
            <Text style={screenStyles.tblDescText}>{item.description}</Text>
          </View> */}
        </_DefaultCard>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { ForkliftNotificationDetails };
