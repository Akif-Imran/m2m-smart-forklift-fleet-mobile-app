import { colors, gStyles } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  iconContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    // borderWidth: 1,
  },
  dataContainer: {
    flex: 9,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    padding: 10,
    // borderWidth: 1,
  },
  forwardContainer: {
    flex: 1,
    // padding:10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    // borderWidth: 1,
  },
  largeCard: {
    ...gStyles.card,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
});
