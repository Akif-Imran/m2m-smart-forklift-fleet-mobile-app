import { theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  imgStyle: {
    width: 120,
    height: 120,
    overflow: "hidden",
    borderRadius: theme.radius.md,
    marginVertical: theme.spacing.xs,
    // borderWidth: 1,
  },
});
