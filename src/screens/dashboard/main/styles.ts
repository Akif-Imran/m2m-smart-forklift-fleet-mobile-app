import { gStyles, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    ...gStyles.card,
    minHeight: 170,
  },
  headerText: {
    ...gStyles.headerText,
    textAlign: "left",
  },
});
