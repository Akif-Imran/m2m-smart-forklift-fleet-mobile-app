import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { colors, gStyles } from "@theme";
import { listCardStyles } from "@screen-styles";
import { useNavigation } from "@react-navigation/native";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { FontAwesome5 } from "@expo/vector-icons";
import { baseURL } from "@api";

interface OwnProps {
  item: IVehicle;
  mode?: "info" | "list";
}

const _ForkliftListCard: React.FC<OwnProps> = ({ item, mode = "list" }) => {
  const navigation =
    useNavigation<
      ProfileSettingsStackScreenProps<"VehicleIcons">["navigation"]
    >();
  return (
    <_DefaultCard>
      <TouchableOpacity
        style={StyleSheet.compose(listCardStyles.contentContainer, {
          backgroundColor: mode === "info" ? colors.white : colors.thinGray,
        })}
        activeOpacity={mode === "info" ? 1 : 0.7}
        onPress={
          mode === "info"
            ? undefined
            : () =>
                navigation.navigate("SelectIcon", {
                  item: item,
                  _id: item.id.toString(),
                })
        }
      >
        <View>
          {item.picture ? (
            <Image
              source={{ uri: `${baseURL}${item.picture}` }}
              resizeMode="cover"
              style={listCardStyles.imgStyle}
            />
          ) : (
            <Image
              source={require("../../../../assets/images/user.png")}
              resizeMode="contain"
              style={listCardStyles.imgStyle}
            />
          )}
        </View>
        <View style={listCardStyles.infoWithForward}>
          <View style={listCardStyles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.reg_no}</Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.make}-{item.model}-{item.year}
            </Text>

            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={0.5}
            >
              {item.fuel_type_name}
            </Text>
          </View>

          <View
            style={StyleSheet.compose(listCardStyles.forwardContainer, {
              flexDirection: "row",
            })}
          >
            {/* <Text
              style={StyleSheet.compose(screenStyles.badgeText, {
                backgroundColor: ForkliftStatusColor[item.status],
              })}
            >
              {truncateText(item.status, 35).toUpperCase()}
            </Text> */}
            {mode === "info" ? undefined : (
              <FontAwesome5
                name="caret-right"
                size={20}
                color={colors.iconGray}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </_DefaultCard>
  );
};

export { _ForkliftListCard };
