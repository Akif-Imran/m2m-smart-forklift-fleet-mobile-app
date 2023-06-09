import { colors } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // paddingTop: 50,
    // paddingHorizontal: 20,
    backgroundColor: colors.mediumGray,
    // marginBottom: 2,
    // paddingBottom: 10,
    // borderWidth: 1,
    // overflow: "scroll",
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
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
