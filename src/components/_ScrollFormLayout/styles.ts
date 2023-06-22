import { colors, theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollStyle: {
    flex: 1,
    backgroundColor: "transparent",
    marginTop: theme.header.height,
    // paddingHorizontal: theme.spacing.md,
    // borderWidth: 1,
  },
  scrollViewContentContainer: {
    // flex: 1,
    justifyContent: "space-between",
    // borderWidth: 1,
  },
});
