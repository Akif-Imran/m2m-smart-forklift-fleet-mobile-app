import { StyleSheet } from "react-native";

import { colors } from "../../../../theme";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginVertical: 4,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  modalStyle: {
    // height: 150,
    paddingHorizontal: 15,
    paddingVertical: 25,
    margin: 20,
    borderRadius: 15,
    backgroundColor: colors.white,
    // borderWidth: 1,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  headerText: {
    fontFamily: "Visby-Bold",
    fontSize: 24,
    color: colors.titleText,
  },
  orderInputContainer: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 45,
    // borderWidth: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
