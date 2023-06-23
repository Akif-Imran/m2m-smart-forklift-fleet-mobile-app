import { colors, gStyles, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    ...gStyles.card,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
  },
  iconContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    // borderWidth: 1,
  },
});
