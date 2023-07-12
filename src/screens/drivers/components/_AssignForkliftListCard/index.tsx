import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { _DefaultCard } from "@components";
import { Ionicons } from "@expo/vector-icons";
import { colors, gStyles } from "@theme";
import { truncateText } from "@utility";
import { listCardStyles } from "@screen-styles";
import { baseURL } from "@api";

import { styles } from "./styles";

interface OwnProps {
  item: IVehicle;
  checked: boolean;
  toggleAssignment: (forkliftId: number) => void;
}

const _AssignForkliftListCard: React.FC<OwnProps> = ({
  item,
  checked,
  toggleAssignment,
}) => {
  return (
    <_DefaultCard onPress={() => toggleAssignment(item.id)}>
      <View
        style={StyleSheet.compose(listCardStyles.contentContainer, {
          backgroundColor: colors.white,
        })}
      >
        {checked ? (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary}
            style={styles.assignCheck}
          />
        ) : null}
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
              {item.model}-{item.make}-{item.year}
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "nowrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={gStyles.tblDescText}
                ellipsizeMode="tail"
                numberOfLines={0.5}
              >
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
