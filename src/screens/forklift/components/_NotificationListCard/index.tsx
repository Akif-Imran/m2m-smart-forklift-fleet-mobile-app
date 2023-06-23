import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { _DefaultCard } from "@components";
import { useNavigation } from "@react-navigation/native";
import { ForkliftStackScreenProps } from "@navigation-types";
import { list_card_styles } from "src/screens/styles";
import { colors, gStyles, theme } from "@theme";
import { Ionicons, Entypo } from "@expo/vector-icons";
import moment from "moment";

interface OwnProps {
  item: INotification;
  handleDelete: (notificationId: string) => void;
}

const _NotificationListCard: React.FC<OwnProps> = ({ handleDelete, item }) => {
  const navigation = useNavigation<ForkliftStackScreenProps<"Notification">["navigation"]>();

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
        style={StyleSheet.compose(list_card_styles.contentContainer, {
          backgroundColor: colors.white,
        })}
      >
        <View
        // style={{
        //   display: "flex",
        //   flexDirection: "row",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   // borderWidth: 1,
        // }}
        >
          <Ionicons name="notifications" size={45} color={colors.titleText} />
        </View>
        <View style={list_card_styles.infoWithForward}>
          <View style={list_card_styles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.regNo}</Text>
            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
              {item.event}
            </Text>
            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
              {moment(item.date).format("DD MMM, YYYY hh:mm A")}
            </Text>
          </View>
          <View style={list_card_styles.forwardContainer}>
            <Entypo name="chevron-right" size={20} color={colors.iconGray} />
          </View>
        </View>
      </View>
    </_DefaultCard>
  );
};

export { _NotificationListCard };
