import { Text, View } from "react-native";
import React from "react";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "@screen-styles";
import { _DefaultCard, _ScrollFormLayout } from "@components";
import moment from "moment";

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
            <Text style={screenStyles.tblDescText}>{item.regNo}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Model</Text>
            <Text style={screenStyles.tblDescText}>{item.model}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Event</Text>
            <Text style={screenStyles.tblDescText}>{item.event}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Driver</Text>
            <Text style={screenStyles.tblDescText}>{item.driver}</Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Forklift</Text>
            <Text style={screenStyles.tblDescText}>
              {moment(item.date).format("DD MMM, YYYY hh:mm A")}
            </Text>
          </View>
          <View style={screenStyles.fieldContainer}>
            <Text style={screenStyles.tblHeaderText}>Description</Text>
            <Text style={screenStyles.tblDescText}>{item.description}</Text>
          </View>
        </_DefaultCard>
      </_ScrollFormLayout>
    </SafeAreaView>
  );
};

export { ForkliftNotificationDetails };
