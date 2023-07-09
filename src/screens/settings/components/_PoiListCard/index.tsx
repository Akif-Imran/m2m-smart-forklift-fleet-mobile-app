import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { colors, gStyles } from "@theme";
import { listCardStyles, screenStyles } from "@screen-styles";
import { useNavigation } from "@react-navigation/native";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { truncateText } from "@utility";
import { FontAwesome5 } from "@expo/vector-icons";
import { PoiTypesColor } from "@constants";
import { images } from "@markers";

interface OwnProps {
  item: IPoi;
  mode?: "info" | "list";
  handleDelete: (poiId: string) => void;
}

const _PoiListCard: React.FC<OwnProps> = ({ item, mode = "list" }) => {
  const navigation =
    useNavigation<ProfileSettingsStackScreenProps<"Pois">["navigation"]>();
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
                navigation.navigate("ViewPoiOnMap", {
                  item: item,
                  _id: item._id,
                })
        }
      >
        <View>
          <Image
            source={images[`${item.iconName}-${item.color}`]}
            resizeMode="contain"
            style={listCardStyles.imgStyle}
          />
        </View>
        <View style={listCardStyles.infoWithForward}>
          <View style={listCardStyles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.name}</Text>
            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.latitude},{item.longitude}
            </Text>

            <Text
              style={gStyles.tblDescText}
              ellipsizeMode="tail"
              numberOfLines={0.5}
            >
              {truncateText(item.address, 22)}
            </Text>
          </View>

          <View
            style={StyleSheet.compose(listCardStyles.forwardContainer, {
              flexDirection: "row",
            })}
          >
            <Text
              style={StyleSheet.compose(screenStyles.badgeText, {
                backgroundColor: PoiTypesColor[item.type],
              })}
            >
              {truncateText(item.type, 35).toUpperCase()}
            </Text>
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

export { _PoiListCard };
