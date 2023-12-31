import { colors } from "@theme";
import { Dimensions } from "react-native";

export const defaultLocation = {
  latitude: 2.9703305,
  longitude: 101.6096447,
};
export const ForkliftStatusColor: Record<string, string> = {
  faulty: colors.error,
  offline: colors.error,
  parked: colors.info,
  moving: colors.primary,
  idling: colors.warning,
  total: colors.titleText,
};

export const ServiceStatusColor: Record<string, string> = {
  //how api returns response
  Pending: colors.error,
  Completed: colors.primary,
  "In Process": colors.titleText,
  //how app handles it
  pending: colors.error,
  completed: colors.primary,
  inprocess: colors.titleText,
};

export const PoiTypesColor: Record<string, string> = {
  private: colors.error,
  business: colors.primary,
  total: colors.titleText,
};

export const ForkliftNotificationStatusColor: Record<string, string> = {};

export enum ForkliftNotificationsFilters {
  "ALL" = 1,
  "DRIVER" = 2,
  "SERVICE" = 3,
}
export enum DriversFilters {
  "ALL" = 1,
  "ASSIGNED" = 2,
  "UNASSIGNED" = 3,
}
export enum AssignForkliftFilters {
  "ALL" = 1,
  "NAME",
  "ID",
}
export enum ActivityFilters {
  "ALL" = 1,
}

export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get("window");
export const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
