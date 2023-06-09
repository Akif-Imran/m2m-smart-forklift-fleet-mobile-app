import { colors } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  iconContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    // borderWidth: 1,
  },
  dataContainer: {
    flex: 9,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    padding: 10,
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
  largeCard: {
    backgroundColor: colors.white,
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    marginTop: 8,
    marginBottom: 2,
  },
  largeHeaderText: {
    fontFamily: "Visby-Bold",
    fontSize: 20,
    color: colors.titleText,
  },
  subTitleText: {
    fontFamily: "Visby-Medium",
    fontSize: 14,
    color: colors.textGray,
  },
});
