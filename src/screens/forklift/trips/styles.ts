import { colors, gStyles, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  menuDateHeader: {
    ...gStyles.cardInfoTitleText,
    marginTop: 15,
    // borderWidth: 1,
  },
  descTextGray: {
    // flex: 3,
    fontFamily: "Visby-Medium",
    fontSize: 12,
    color: colors.titleText,
    // borderWidth: 1,
  },
  //timeline component styles
  TimelineComponentContainer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    // borderWidth: 1,
  },
  circleStyle: {
    overflow: "hidden",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    borderWidth: 2,
  },
  iconStyle: {
    ...theme.img.size.xs,
    tintColor: colors.titleText,
  },
  listViewStyle: {
    paddingHorizontal: 10,
  },
  // bottom Sheet Styles
  sheetMainContainer: { justifyContent: "center" },
  sheetTopLeftRightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0,
    width: "100%",
  },
  sheetTopLeftRightIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  sheetTopIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.xl,
    borderWidth: 0,
  },
  sheetTopIcon: {
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  lastPositioningWithAddressContainer: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  lastUpdateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  lastUpdateContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    columnGap: theme.spacing.sm,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderWidth: 0,
  },
  sheetButton: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
});
