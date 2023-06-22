import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { PaperTheme, gStyles } from "@theme";

interface OwnProps {}
const _DefaultCard: React.FC<React.PropsWithChildren<OwnProps>> = ({ children }) => {
  return (
    <Card elevation={0} mode="elevated" theme={PaperTheme} style={gStyles.card}>
      {children}
    </Card>
  );
};

export { _DefaultCard };

const styles = StyleSheet.create({});
