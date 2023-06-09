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
});
