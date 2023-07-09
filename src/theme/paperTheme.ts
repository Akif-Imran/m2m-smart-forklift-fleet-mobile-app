import type { Theme } from "react-native-paper";
import { DefaultTheme } from "react-native-paper";

import { colors } from "./colors";

const PaperTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 10,
  fonts: {
    thin: {
      fontFamily: "Visby-Regular",
      fontWeight: "normal",
    },
    regular: {
      fontFamily: "Visby-Medium",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Visby-Bold",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Visby-Medium",
      fontWeight: "400",
    },
  },
  colors: {
    ...DefaultTheme.colors,
    error: colors.error,
    text: colors.qtyTextGray,
    placeholder: colors.qtyTextGray,
    primary: colors.primary,
    notification: colors.secondary,
    accent: colors.secondary,
  },
};

export { PaperTheme };
