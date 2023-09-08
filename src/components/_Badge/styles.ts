import { colors, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderColor: colors.borderColor,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    // borderWidth: 1,
  },
  online: {
    backgroundColor: colors.primary,
  },
  offline: {
    backgroundColor: colors.error,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    textAlign: "center",
    justifyContent: "center",
    textAlignVertical: "center",
    fontFamily: theme.font.medium,
    fontSize: theme.fontSize.sm,
    color: colors.titleText,
  },
  onlineText: {
    color: colors.primary,
  },
  offlineText: {
    color: colors.error,
  },
});
