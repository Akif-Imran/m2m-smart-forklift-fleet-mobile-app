import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { listCardStyles } from "@screen-styles";
import { colors, gStyles } from "@theme";
import { Ionicons } from "@expo/vector-icons";
import { FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12 } from "@utility";

interface OwnProps {
  item: IAlarmReport;
}

const _AlarmListCard: React.FC<OwnProps> = ({ item }) => {
  return (
    <_DefaultCard>
      <View
        style={StyleSheet.compose(listCardStyles.contentContainer, {
          backgroundColor: colors.white,
        })}
      >
        <View>
          <Ionicons name="notifications" size={45} color={colors.titleText} />
        </View>
        <View style={listCardStyles.infoWithForward}>
          <View style={listCardStyles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.command_type}</Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12(item.gps_time)}
            </Text>
          </View>
          <View style={listCardStyles.forwardContainer}>
            {/* <Entypo name="chevron-right" size={20} color={colors.iconGray} /> */}
          </View>
        </View>
      </View>
    </_DefaultCard>
  );
};

export { _AlarmListCard };
