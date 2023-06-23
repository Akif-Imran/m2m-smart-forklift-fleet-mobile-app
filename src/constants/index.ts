import { colors } from "@theme";

export const ForkliftStatusColor: Record<string, string> = {
  faulty: colors.error,
  offline: colors.warning,
  parked: colors.info,
  moving: colors.primary,
  total: colors.titleText,
};
export const ForkliftNotificationStatusColor: Record<string, string> = {};

export enum ForkliftNotificationsFilters {
  "ALL" = 1,
  "ON" = 2,
  "OFF" = 3,
}
