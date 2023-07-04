import { colors, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  arrMappingContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  modalContent: {
    backgroundColor: colors.white,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    marginHorizontal: theme.spacing.xxl,
    borderRadius: theme.radius.lg,
    minHeight: 320,
    // borderWidth: 1,
  },
  colorButton: {
    width: 25,
    height: 25,
    borderRadius: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
