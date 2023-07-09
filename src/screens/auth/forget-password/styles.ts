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
    flex: 2,
    paddingVertical: 15,
    // paddingTop: 50,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    // borderWidth: 1,
  },
  inputContainer: {
    flex: 1,
    paddingTop: 45,
    // alignItems: "center",
    // borderWidth: 1,
  },
  textFieldContainer: {
    // flex: 1,
    marginVertical: 8,
    // borderWidth: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "center",
    // borderWidth: 1,
  },
  imgContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  imgStyle: {
    // flex: 1,
    width: 150,
    height: 150,
    borderWidth: 0,
    tintColor: colors.primary,
    // height: 100,
  },
});
