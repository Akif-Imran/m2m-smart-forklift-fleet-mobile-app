import { theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  imgStyle: {
    width: 125,
    height: 125,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    marginVertical: theme.spacing.xs,
    // borderWidth: 1,
  },
});
