import { StyleSheet } from "react-native";
import { colors } from "../../../theme";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: 50,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  keyboardViewContainer: {
    flex: 1,
    // borderWidth: 1,
  },
  textContainer: {
    flex: 1.75,
    paddingVertical: 15,
    // paddingTop: 50,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    // borderWidth: 1,
  },
  imageContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    // flex: 1,
    width: 200,
    height: 200,
    borderWidth: 0,
  },
  inputContainer: {
    flex: 2.25,
    // alignItems: "center",
    // borderWidth: 1,
  },
  textInputStyle: {
    fontSize: 16,
    color: colors.textGray,
  },
  textFieldContainer: {
    // flex: 1,
    marginVertical: 8,
    // borderWidth: 1,
  },
  forgotPasswordContainer: { marginTop: 15 },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "center",
    // borderWidth: 1,
  },
  buttonStyle: {
    // width: "100%",
    paddingVertical: 8,
  },
});
