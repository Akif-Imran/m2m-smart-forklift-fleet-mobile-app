import type { TextStyle } from "react-native";
import { Text, View } from "react-native";
import React from "react";
import { gStyles, theme } from "@theme";
import { Divider } from "react-native-paper";

import { styles } from "./styles";

interface OwnProps {
  title?: string;
  textAlign?: TextStyle["textAlign"];
  inset?: boolean;
  marginVertical?: number;
}

const _Divider: React.FC<OwnProps> = ({
  title = "",
  inset = false,
  marginVertical = theme.spacing.xs,
  textAlign = "center",
}) => {
  return (
    <View style={styles.spacing}>
      {title && (
        <Text style={[gStyles.tblHeaderText, { textAlign }]}>{title}</Text>
      )}
      <Divider style={{ marginVertical: marginVertical }} inset={inset} />
    </View>
  );
};

export { _Divider };
