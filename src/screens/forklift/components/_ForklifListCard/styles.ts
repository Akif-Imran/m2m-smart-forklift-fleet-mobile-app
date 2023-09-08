import { colors, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: theme.spacing.xs,
  },
  imgContainer: {
    borderWidth: 2,
    borderRadius: theme.radius.full,
    padding: theme.spacing.md,
    borderColor: colors.warning,
  },
});
