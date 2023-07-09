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
    flex: 2,
    // alignItems: "center",
    paddingBottom: 15,
    // borderWidth: 1,
  },
  textFieldContainer: {
    // flex: 1,
    marginVertical: 8,
    // borderWidth: 1,
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: "flex-start",
    // alignItems: "center",
    // borderWidth: 1,
  },
  modalStyle: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 15,
    paddingHorizontal: 15,
    // borderWidth: 1,
  },
  scrollViewContentContainer: {
    // flex: 1,
    justifyContent: "space-between",
    // borderWidth: 1,
  },
});
