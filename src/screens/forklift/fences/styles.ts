import { colors, gStyles, theme } from "@theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  placeholder: {
    ...gStyles.tblDescText,
  },
  // defaultControls: {
  //   position: "relative",
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   gap: theme.spacing.sm,
  //   borderRadius: theme.radius.md,
  // },
  circleControls: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingTop: theme.spacing.none,
    borderWidth: 0,
    ...Platform.select({
      ios: {
        paddingBottom: theme.spacing.none,
      },
      android: {
        paddingBottom: theme.spacing.xxxl,
      },
    }),
  },
  sliderContainer: {
    // width: "100%",
    backgroundColor: colors.white,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    justifyContent: "center",
    ...Platform.select({
      ios: {
        paddingVertical: theme.spacing.md,
      },
      android: {
        paddingVertical: theme.spacing.none,
      },
    }),
  },
  sliderHeight: {
    height: 56,
  },
  countAlignment: {
    alignSelf: "center",
    minWidth: 48,
  },
});
