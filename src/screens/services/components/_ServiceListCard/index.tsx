import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { useNavigation } from "@react-navigation/native";
import type { ServiceStackScreenProps } from "@navigation-types";
import { listCardStyles, screenStyles } from "@screen-styles";
import { truncateText } from "@utility";
import { colors, gStyles } from "@theme";
import { ServiceStatusColor } from "@constants";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";

interface OwnProps {
  item: IService;
  handleDelete: (serviceId: number) => void;
}

const _ServiceListCard: React.FC<OwnProps> = ({ handleDelete, item }) => {
  const navigation =
    useNavigation<ServiceStackScreenProps<"Services">["navigation"]>();
  return (
    <_DefaultCard
      onLongPress={() => handleDelete(item.id)}
      onPress={() =>
        navigation.navigate("ServiceDetails", {
          _id: item.id.toString(),
          item: item,
        })
      }
    >
      <View
        style={StyleSheet.compose(listCardStyles.contentContainer, {
          backgroundColor: colors.white,
        })}
      >
        {/* <View>
          <FontAwesome5 name="tools" size={45} color={colors.titleText} />
        </View> */}
        <View style={listCardStyles.infoWithForward}>
          <View style={listCardStyles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.id}</Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {moment(item.service_date).format("DD MMM, YYYY hh:mm A")}
            </Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={0.5}
            >
              {truncateText(item.type_name, 22)}
            </Text>
          </View>

          <View
            style={StyleSheet.compose(listCardStyles.forwardContainer, {
              flexDirection: "row",
            })}
          >
            <Text
              style={StyleSheet.compose(
                StyleSheet.compose(
                  gStyles.tblHeaderText,
                  screenStyles.badgeText
                ),
                {
                  backgroundColor: ServiceStatusColor[item.status],
                }
              )}
            >
              {truncateText(item.status, 35).toUpperCase()}
            </Text>
            <FontAwesome5
              name="caret-right"
              size={20}
              color={colors.iconGray}
            />
          </View>
        </View>
      </View>
    </_DefaultCard>
  );
};

export { _ServiceListCard };
