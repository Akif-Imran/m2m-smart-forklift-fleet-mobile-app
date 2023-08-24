import { theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollStyle: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
    marginTop: theme.header.height,
    // paddingHorizontal: theme.spacing.md,
    // borderWidth: 1,
  },
  scrollStyleNoSpacing: {
    flex: 1,
    backgroundColor: theme.colors.transparent,
    marginTop: theme.spacing.none,
    // paddingHorizontal: theme.spacing.md,
    // borderWidth: 1,
  },
  scrollViewContentContainer: {
    // flex: 1,
    justifyContent: "space-between",
    // borderWidth: 1,
  },
});
