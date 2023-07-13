import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { useNavigation } from "@react-navigation/native";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { listCardStyles } from "@screen-styles";
import { colors, gStyles } from "@theme";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12 } from "@utility";

interface OwnProps {
  item: INotification;
  handleDelete: (notificationId: string) => void;
}

const _NotificationListCard: React.FC<OwnProps> = ({ handleDelete, item }) => {
  const navigation =
    useNavigation<ForkliftStackScreenProps<"Notification">["navigation"]>();

  return (
    <_DefaultCard
      onLongPress={() => handleDelete(item._id)}
      onPress={() =>
        navigation.navigate("NotificationDetails", {
          item: item,
          _id: item._id,
        })
      }
    >
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
            <Text style={gStyles.cardInfoTitleText}>{item.title}</Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.body}
            </Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {FORMAT_DATE_STRING_DD_MM_YYYY_HH_MM_12(item.createdAt)}
            </Text>
          </View>
          <View style={listCardStyles.forwardContainer}>
            <Entypo name="chevron-right" size={20} color={colors.iconGray} />
          </View>
        </View>
      </View>
    </_DefaultCard>
  );
};

export { _NotificationListCard };
