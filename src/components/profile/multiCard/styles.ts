import { colors, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    paddingLeft: theme.spacing.md,
    backgroundColor: colors.white,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  iconContainer: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 0,
    paddingLeft: 0,
    // borderWidth: 1,
  },
  iconWrapper: {
    padding: 5,
    borderRadius: 6,
    // borderWidth: 1,
  },
  dataContainer: {
    flex: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingTop: 10,
    // paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 0,
    // borderWidth: 1,
  },
  forwardContainer: {
    flex: 1,
    // padding:10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    // borderWidth: 1,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.white,
    // borderRadius: 8,
    flexDirection: "row",
    paddingBottom: 5,
    paddingTop: 5,
    borderColor: colors.mediumGray,
    borderBottomWidth: 1,
  },
  headerText: {
    fontFamily: "Visby-Bold",
    fontSize: 14,
    color: colors.titleText,
  },
  subTitleText: {
    fontFamily: "Visby-Medium",
    fontSize: 16,
    color: colors.textGray,
  },
});
