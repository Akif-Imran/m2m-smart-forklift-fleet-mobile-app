import { Text, TextStyle, View } from "react-native";
import React from "react";

import { gStyles, theme } from "@theme";
import { Divider } from "react-native-paper";

interface OwnProps {
  title?: string;
  textAlign?: TextStyle["textAlign"];
  inset?: boolean;
  marginVertical?: number;
}

const _Divider: React.FC<OwnProps> = ({
  title = "Divider",
  inset = false,
  marginVertical = theme.spacing.xs,
  textAlign = "center",
}) => {
  return (
    <View>
      <Text style={[gStyles.tblHeaderText, { textAlign }]}>{title}</Text>
      <Divider style={{ marginVertical: marginVertical }} inset={inset} />
    </View>
  );
};

export { _Divider };
