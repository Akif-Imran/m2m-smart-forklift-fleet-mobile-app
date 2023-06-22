import { colors } from "@theme";

export const ForkliftStatusColor: Record<string, string> = {
  faulty: colors.error,
  quotation: colors.warning,
  offline: colors.black,
  parked: colors.info,
  moving: colors.primary,
};
