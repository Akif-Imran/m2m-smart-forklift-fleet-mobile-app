import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { styles } from "./styles";
import { _DefaultCard } from "@components";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors, gStyles, theme } from "@theme";
import { truncateText } from "@utility";
import { list_card_styles, screenStyles } from "src/screens/styles";
import { ForkliftStatusColor } from "@constants";

interface OwnProps {
  item: IForklift;
  checked: boolean;
  toggleAssignment: (forkliftId: string) => void;
}

const _AssignForkliftListCard: React.FC<OwnProps> = ({ item, checked, toggleAssignment }) => {
  const [selected, setSelected] = React.useState(false);

  return (
    <_DefaultCard onPress={() => toggleAssignment(item._id)}>
      <View
        style={StyleSheet.compose(list_card_styles.contentContainer, {
          backgroundColor: colors.white,
        })}
      >
        {checked ? (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary}
            style={{
              position: "absolute",
              top: theme.spacing.none,
              right: theme.spacing.sm,
            }}
          />
        ) : null}
        <View>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              resizeMode="cover"
              style={list_card_styles.imgStyle}
            />
          ) : (
            <Image
              source={require("../../../../assets/images/user.png")}
              resizeMode="contain"
              style={list_card_styles.imgStyle}
            />
          )}
        </View>
        <View style={list_card_styles.infoWithForward}>
          <View style={list_card_styles.infoContainer}>
            <Text style={gStyles.cardInfoTitleText}>{item.name}</Text>
            <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={1}>
              {item.driver}
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={gStyles.tblDescText} ellipsizeMode="tail" numberOfLines={0.5}>
                {truncateText(item.model, 22)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </_DefaultCard>
  );
};

export { _AssignForkliftListCard };
