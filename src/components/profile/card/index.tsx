import { ImageRequireSource, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { FC, Requireable } from "react";
import { PaperTheme, colors } from "../../../theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Avatar } from "react-native-paper";
import Toast from "react-native-root-toast";
import { useAuthContext } from "@context";
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
const Card: FC<CardProps> = ({ data, size }) => {
  const { user } = useAuthContext();
  return (
    <TouchableOpacity
      style={styles.largeCard}
      activeOpacity={0.8}
      onPress={() => Toast.show("Profile Info!", { duration: 3000, animation: true })}
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
        <Text style={styles.largeHeaderText}>{user?.name}</Text>
        <Text style={styles.subTitleText}>{user?.email}</Text>
        <Text style={styles.subTitleText}>(Salesman)</Text>
      </View>
      <View style={styles.forwardContainer}>
        <MaterialIcons name="keyboard-arrow-right" color={colors.textGray} size={20} />
      </View>
    </TouchableOpacity>
  );
};

export { Card };
