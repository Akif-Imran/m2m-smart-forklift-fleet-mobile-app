import { colors, gStyles, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  placeholder: {
    ...gStyles.tblDescText,
  },
  iconsContainer: {
    flexDirection: "row",
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  iconButton: {
    backgroundColor: colors.white,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
