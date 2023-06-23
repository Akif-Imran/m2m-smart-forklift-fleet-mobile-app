import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { _DefaultCard } from "@components";
import { useNavigation } from "@react-navigation/native";
import { ServiceStackScreenProps } from "@navigation-types";
import { list_card_styles, screenStyles } from "src/screens/styles";
import { truncateText } from "@utility";
import { colors, gStyles, theme } from "@theme";
import { ServiceStatusColor } from "@constants";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";

interface OwnProps {
  item: IService;
  handleDelete: (serviceId: string) => void;
}

const _ServiceListCard: React.FC<OwnProps> = ({ handleDelete, item }) => {
  const navigation = useNavigation<ServiceStackScreenProps<"Services">["navigation"]>();
  return (
    <_DefaultCard
      onLongPress={() => handleDelete(item._id)}
      onPress={() =>
        navigation.navigate("ServiceDetails", {
          _id: item._id,
          item: item,
        })
      }
    >
      <View
        style={StyleSheet.compose(list_card_styles.contentContainer, {
          backgroundColor: colors.white,
        })}
      >
        <View>
          <FontAwesome5 name="tools" size={45} color={colors.iconGray} />
        </View>
        <View style={list_card_styles.infoWithForward}>
          <View
            style={StyleSheet.compose(list_card_styles.infoContainer, { rowGap: theme.spacing.xs })}
          >
            <Text style={gStyles.cardInfoTitleText}>{item.regNo}</Text>
            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
              {moment(item.date).format("DD MMM, YYYY hh:mm A")}
            </Text>
            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={0.5}>
              {truncateText(item.type, 22)}
            </Text>
          </View>

          <View
            style={StyleSheet.compose(list_card_styles.forwardContainer, { flexDirection: "row" })}
          >
            <Text
              style={StyleSheet.compose(
                StyleSheet.compose(gStyles.tblHeaderText, screenStyles.badgeText),
                {
                  backgroundColor: ServiceStatusColor[item.status],
                }
              )}
            >
              {truncateText(item.status, 35).toUpperCase()}
            </Text>
            <FontAwesome5 name="caret-right" size={20} color={colors.iconGray} />
          </View>
        </View>
      </View>
    </_DefaultCard>
  );
};

export { _ServiceListCard };
