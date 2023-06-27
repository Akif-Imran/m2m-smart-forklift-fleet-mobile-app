import { gStyles } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  placeholder: {
    ...gStyles.tblDescText,
  },
  barcodeBox: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    // borderWidth: 1,
  },
});
