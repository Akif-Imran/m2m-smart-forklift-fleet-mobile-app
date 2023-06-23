import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card, CardProps } from "react-native-paper";
import { PaperTheme, gStyles } from "@theme";

interface OwnProps extends Pick<CardProps, "onPress" | "onLongPress" | "style"> {}
const _DefaultCard: React.FC<React.PropsWithChildren<OwnProps>> = ({
  children,
  onPress,
  onLongPress,
  style = gStyles.card,
}) => {
  return (
    <Card
      elevation={0}
      mode="elevated"
      theme={PaperTheme}
      style={style}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </Card>
  );
};

export { _DefaultCard };

const styles = StyleSheet.create({});
