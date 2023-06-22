import { colors } from "@theme";

export const ForkliftStatusColor: Record<string, string> = {
  faulty: colors.error,
  offline: colors.warning,
  parked: colors.info,
  moving: colors.primary,
  total: colors.titleText,
};
