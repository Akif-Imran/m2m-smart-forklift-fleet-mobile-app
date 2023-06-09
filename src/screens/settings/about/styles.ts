import { colors } from "../../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingTop: 50,
    // paddingHorizontal: 20,
    backgroundColor: colors.mediumGray,
    // marginBottom: 2,
    // paddingBottom: 10,
    // borderWidth: 1,
    // overflow: "scroll",
  },
  inputContainer: {
    marginVertical: 2,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 15,
  },
  card: {
    marginVertical: 4,
    paddingTop: 8,
    borderRadius: 15,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "center",
    // borderWidth: 1,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // borderWidth: 1,
  },
  title: {
    textAlign: "center",
    fontFamily: "Visby-Bold",
    fontSize: 24,
    color: colors.primary,
    // borderWidth: 1,
  },
  spacing: {
    marginTop: 12,
  },
  paragraph: {
    textAlign: "justify",
    fontFamily: "Visby-Medium",
    fontSize: 14,
    color: colors.titleText,
    // borderWidth: 1,
  },
});
