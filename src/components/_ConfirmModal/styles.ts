import { colors, theme } from "@theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    height: 290,
    borderRadius: theme.radius.md,
    alignSelf: "baseline",
  },
  modalContent: {
    paddingHorizontal: theme.spacing.lg,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    // borderWidth: 1,
  },
  lottieView: {
    width: 200,
    height: 200,
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        shadowRadius: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
      },
      android: {
        elevation: 0,
      },
    }),
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    columnGap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    // borderWidth: 1,
  },
  buttonStyle: {
    flex: 1,
    ...Platform.select({
      ios: {
        shadowRadius: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
      },
      android: {
        elevation: 0,
      },
    }),
  },
});
