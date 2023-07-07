import { colors, gStyles } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    borderWidth: 1,
  },
  menuDateHeader: {
    ...gStyles.cardInfoTitleText,
    // borderWidth: 1,
    marginTop: 15,
  },
  timelineCard: {
    position: "relative",
    marginTop: 15,
    borderRadius: 8,
    marginHorizontal: 8,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  routeSelectorContainer: {
    flex: 1,
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    paddingBottom: 15,
    backgroundColor: colors.mediumGray,
    // borderWidth: 1,
  },
  topRightButton: {
    top: 15,
    right: 15,
  },
  routeSelectorButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
  },
  routeSelectedLabel: {
    fontSize: 14,
    fontStyle: "normal",
    textAlign: "center",
    fontFamily: "Visby-Bold",
    textAlignVertical: "center",
    // borderWidth: 1,
  },

  routeDarkLabel: {
    color: colors.titleText,
  },
  routeLightLabel: {
    color: colors.titleText,
  },
  routeSelectedDistanceLabel: {
    fontSize: 12,
    fontStyle: "normal",
    textAlign: "center",
    fontFamily: "Visby-Medium",
    textAlignVertical: "center",
    // borderWidth: 1,
  },
  descTextGray: {
    // flex: 3,
    fontFamily: "Visby-Medium",
    fontSize: 12,
    color: colors.titleText,
    // borderWidth: 1,
  },
  descTextBlack: {
    // flex: 3,
    fontFamily: "Visby-Medium",
    fontSize: 12,
    color: colors.titleText,
    // borderWidth: 1,
  },
});
