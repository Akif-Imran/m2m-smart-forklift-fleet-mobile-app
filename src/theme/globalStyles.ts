import { StyleSheet } from "react-native";
import colors from "./colors";

const globalStyles = StyleSheet.create({
  headerText: {
    fontFamily: "Visby-Heavy",
    textAlign: "center",
    flexWrap: "wrap",
    fontSize: 24,
    color: colors.titleText,
  },
  cardInfoTitleText: {
    fontFamily: "Visby-Bold",
    fontSize: 16,
    color: colors.titleText,
    textAlign: "left",
    textAlignVertical: "center",
    // borderWidth: 1,
  },
  smallHeaderText: {
    fontFamily: "Visby-Bold",
    fontSize: 20,
    color: colors.titleText,
  },
  tinyHeaderText: {
    fontFamily: "Visby-Bold",
    fontSize: 20,
    color: colors.titleText,
  },
  largeDescText: {
    fontFamily: "Visby-Bold",
    fontSize: 16,
    color: colors.qtyTextGray,
  },
  descText: {
    fontFamily: "Visby-Bold",
    fontSize: 14,
    color: colors.qtyTextGray,
  },
  descTextPrimaryBold: {
    fontFamily: "Visby-Bold",
    fontSize: 14,
    // textAlign: "center",
    textAlignVertical: "center",
    color: colors.primary,
  },
  formErrorText: {
    fontFamily: "Visby-Medium",
    fontSize: 12,
    color: colors.error,
  },
  descTextPrimary: {
    fontFamily: "Visby-Medium",
    fontSize: 14,
    textAlign: "center",
    color: colors.primary,
  },
  cardDetailsText: {
    // paddingHorizontal: 4,
    // paddingVertical: 2,
    fontSize: 14,
    fontFamily: "Visby-Regular",
    color: colors.titleText,
  },
  mediumTitleText: {
    // paddingHorizontal: 4,
    // paddingVertical: 2,
    fontSize: 18,
    fontFamily: "Visby-Medium",
    color: colors.titleText,
  },
  cardTitleText: {
    // paddingHorizontal: 4,
    // paddingVertical: 2,
    fontSize: 18,
    fontFamily: "Visby-Medium",
    color: colors.titleText,
  },
  cardDescText: {
    fontSize: 12,
    fontFamily: "Visby-Regular",
    color: colors.titleText,
  },
  infoDarkText: {
    color: colors.titleText,
    fontFamily: "Visby-Bold",
    fontSize: 18,
  },
  infoHeadingText: {
    color: colors.iconGray,
    fontFamily: "Visby-Medium",
    fontSize: 14,
  },
  tblHeaderText: {
    color: colors.titleText,
    fontFamily: "Visby-Bold",
    fontSize: 14,
    // borderWidth: 1,
  },
});

export default globalStyles;
