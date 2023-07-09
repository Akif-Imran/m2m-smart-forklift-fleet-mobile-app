import type { ImageRequireSource } from "react-native";
import { Text, View, TouchableOpacity } from "react-native";
import type { FC } from "react";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Avatar } from "react-native-paper";
import { useAuthContext } from "@context";
import { ToastService } from "@utility";
import { PaperTheme, colors, gStyles } from "@theme";

import { styles } from "./styles";

interface CardProps {
  size: "small" | "large";
  data: Item;
}
interface Item {
  icon: ImageRequireSource;
  color?: string;
  title: string;
  subtitle?: string;
}
const Card: FC<CardProps> = ({ data }) => {
  const {
    state: { user },
  } = useAuthContext();
  return (
    <TouchableOpacity
      style={styles.largeCard}
      activeOpacity={0.8}
      onPress={() => ToastService.show("Profile Info!")}
    >
      <View style={styles.iconContainer}>
        <Avatar.Image
          size={50}
          source={data.icon}
          theme={PaperTheme}
          style={{ backgroundColor: colors.white }}
        />
      </View>
      <View style={styles.dataContainer}>
        <Text style={gStyles.cardInfoTitleText}>{user?.name}</Text>
        <Text style={gStyles.tblDescText}>
          {user?.email || "example.user@gmail.com"}
        </Text>
        <Text style={gStyles.tblDescText}>(Salesman)</Text>
      </View>
      <View style={styles.forwardContainer}>
        <MaterialIcons
          name="keyboard-arrow-right"
          color={colors.textGray}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
};

export { Card };
