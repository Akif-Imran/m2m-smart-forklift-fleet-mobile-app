import { StyleSheet } from "react-native";

import { colors, theme } from "../../../../theme";

export const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.sm,
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  modalStyle: {
    // height: 150,
    paddingHorizontal: 15,
    paddingVertical: 25,
    margin: 20,
    borderRadius: theme.radius.md,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  orderInputContainer: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 45,
    // borderWidth: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
