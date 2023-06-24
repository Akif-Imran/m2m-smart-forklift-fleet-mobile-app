import { theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalStyle: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xl,
  },
  contentStyle: {
    flex: 1,
    justifyContent: "flex-end",
    paddingVertical: 8,
    borderWidth: 0,
  },
});
