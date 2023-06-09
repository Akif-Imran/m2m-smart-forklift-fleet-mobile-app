import { StyleSheet } from "react-native";
import { colors } from "../../theme";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginHorizontal: 2,
  },
  input: {
    // flex: 1,
    width: "100%",
    fontSize: 14,
    color: colors.textGray,
  },
  formErrorText: {
    fontFamily: "Visby-Medium",
    fontSize: 12,
    color: colors.error,
  },
});
