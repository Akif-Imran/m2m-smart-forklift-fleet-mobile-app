import { colors } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // scrollContainer: {
  //   // paddingHorizontal: 10,
  // },
  headerText: {
    fontFamily: "Visby-Bold",
    fontSize: 24,
    color: colors.titleText,
    // marginBottom: 10,
  },
  versionText: {
    marginTop: 15,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "Visby-Regular",
    fontSize: 14,
    color: colors.textGray,
    // borderWidth: 1,
  },
  segmentContainer: {
    marginVertical: 6,
  },
});
