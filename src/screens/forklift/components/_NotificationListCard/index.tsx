import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { useNavigation } from "@react-navigation/native";
import type { ForkliftStackScreenProps } from "@navigation-types";
import { listCardStyles } from "src/screens/styles";
import { colors, gStyles } from "@theme";
import { Ionicons, Entypo } from "@expo/vector-icons";
import moment from "moment";

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
            <Text style={gStyles.cardInfoTitleText}>{item.regNo}</Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.event}
            </Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {moment(item.date).format("DD MMM, YYYY hh:mm A")}
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
