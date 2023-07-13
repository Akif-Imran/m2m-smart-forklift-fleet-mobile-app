import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { _DefaultCard, _Divider } from "@components";
import { colors, gStyles } from "@theme";
import { listCardStyles, screenStyles } from "@screen-styles";
import { useNavigation } from "@react-navigation/native";
import type { ProfileSettingsStackScreenProps } from "@navigation-types";
import { truncateText } from "@utility";
import { FontAwesome5 } from "@expo/vector-icons";
import { PoiTypesColor } from "@constants";
import { images } from "@markers";

import { styles } from "./styles";

interface OwnProps {
  item: IPOI;
  mode?: "info" | "list";
  handleDelete: (poiId: number) => void;
}

const _PoiListCard: React.FC<OwnProps> = ({
  item,
  mode = "list",
  handleDelete,
}) => {
  const navigation =
    useNavigation<ProfileSettingsStackScreenProps<"Pois">["navigation"]>();
  return (
    <_DefaultCard>
      <TouchableOpacity
        style={StyleSheet.compose(listCardStyles.contentContainer, {
          backgroundColor: mode === "info" ? colors.white : colors.thinGray,
        })}
        activeOpacity={mode === "info" ? 1 : 0.7}
        onLongPress={() => {
          handleDelete(item.id);
        }}
        onPress={
          mode === "info"
            ? undefined
            : () =>
                navigation.navigate("ViewPoiOnMap", {
                  item: item,
                  _id: item.id.toString(),
                })
        }
      >
        <View>
          <Image
            source={images[`${item.marker_shape}-${item.color}`]}
            resizeMode="contain"
            style={listCardStyles.imgStyle}
          />
        </View>
        <View
          style={StyleSheet.compose(listCardStyles.infoWithForward, {
            flexDirection: "column",
          })}
        >
          <View style={listCardStyles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.poi_name}</Text>
            <_Divider marginVertical={0} />
            <View style={styles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Latitude</Text>
              <Text style={screenStyles.tblDescText}> {item.latitude}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={screenStyles.tblHeaderText}>Longitude</Text>
              <Text style={screenStyles.tblDescText}> {item.longitude}</Text>
            </View>
            <_Divider marginVertical={0} />
            <View style={styles.fieldContainer}>
              <Text
                style={StyleSheet.compose(screenStyles.tblDescText, {
                  textAlign: "justify",
                })}
              >
                {" "}
                {item.address}
              </Text>
            </View>
          </View>

          <View
            style={StyleSheet.compose(listCardStyles.forwardContainer, {
              flexDirection: "row",
            })}
          >
            <Text
              style={StyleSheet.compose(screenStyles.badgeText, {
                backgroundColor:
                  PoiTypesColor[item.poi_type === 1 ? "private" : "business"],
              })}
            >
              {truncateText(
                item.poi_type === 1 ? "private" : "business",
                35
              ).toUpperCase()}
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
