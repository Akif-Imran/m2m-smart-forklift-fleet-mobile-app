import { colors } from "@theme";
import Toast, { ToastOptions, Durations } from "react-native-root-toast";

export class ToastService {
  private static config: ToastOptions = {
    animation: true,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    textStyle: {
      fontSize: 13,
      fontFamily: "Visby-Medium",
      textAlignVertical: "center",
    },
    keyboardAvoiding: true,
    accessible: false,
    hideOnPress: false,
  };
  static show = (message: string) => {
    Toast.show(message, ToastService.config);
  };
}
