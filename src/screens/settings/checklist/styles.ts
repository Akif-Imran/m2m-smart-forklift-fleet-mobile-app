import { colors, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalStyle: {
    // height: 150,
    paddingHorizontal: 15,
    paddingVertical: 25,
    margin: 20,
    borderRadius: theme.radius.md,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  orderInputContainer: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 45,
    // borderWidth: 1,
  },
});
