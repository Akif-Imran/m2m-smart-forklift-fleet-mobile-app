import { screenStyles } from "@screen-styles";
import { theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  fieldContainer: {
    ...screenStyles.fieldContainer,
    marginVertical: theme.spacing.none,
  },
});
