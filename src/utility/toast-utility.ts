import Toast, { ToastOptions, Durations } from "react-native-root-toast";

export class ToastService {
  private static config: ToastOptions = {
    animation: true,
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
  };
  static show = (message: string) => {
    Toast.show(message, ToastService.config);
  };
}
