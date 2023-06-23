import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { colors, gStyles } from "@theme";

interface OwnProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
}

const _ReportCard: React.FC<OwnProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* file icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="file" size={18} color={colors.darkGray} />
      </View>
      {/* report text */}
      <Text style={gStyles.tblHeaderText}>{title}</Text>
      {/* forward icon */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="keyboard-arrow-right" size={25} color={colors.darkGray} />
      </View>
    </TouchableOpacity>
  );
};

export { _ReportCard };
