import { theme } from "@theme";
import { StyleSheet } from "react-native";
import { screenStyles } from "src/screens/styles";

export const styles = StyleSheet.create({
  fieldContainer: {
    ...screenStyles.fieldContainer,
    marginVertical: theme.spacing.none,
  },
});
