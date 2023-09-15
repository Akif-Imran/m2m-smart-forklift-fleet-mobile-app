import { theme } from "@theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: theme.spacing.xs,
  },
  detailsWithAlarms: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  recentAlarmsContainer: {
    flex: 1,
    flexDirection: "row",
    margin: 0,
    // borderWidth: 1,
  },
});
