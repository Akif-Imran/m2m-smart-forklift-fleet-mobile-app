import { theme } from "@theme";
import { StyleSheet } from "react-native";
import { screenStyles } from "@screen-styles";

export const styles = StyleSheet.create({
  fieldContainer: {
    ...screenStyles.fieldContainer,
    marginVertical: theme.spacing.none,
  },
});
