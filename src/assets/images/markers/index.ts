/* eslint-disable import/extensions */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import BikeInfo from "@assets/images/markers/bike-info.png";
import BikePrimary from "@assets/images/markers/bike-primary.png";
import BikeError from "@assets/images/markers/bike-error.png";
import BikeWarning from "@assets/images/markers/bike-warning.png";
import BikeGray from "@assets/images/markers/bike-gray.png";
import BikeDark from "@assets/images/markers/bike-dark.png";
import CarInfo from "@assets/images/markers/car-info.png";
import CarPrimary from "@assets/images/markers/car-primary.png";
import CarError from "@assets/images/markers/car-error.png";
import CarWarning from "@assets/images/markers/car-warning.png";
import CarGray from "@assets/images/markers/car-gray.png";
import CarDark from "@assets/images/markers/car-dark.png";
import FlagInfo from "@assets/images/markers/flag-info.png";
import FlagPrimary from "@assets/images/markers/flag-primary.png";
import FlagError from "@assets/images/markers/flag-error.png";
import FlagWarning from "@assets/images/markers/flag-warning.png";
import FlagGray from "@assets/images/markers/flag-gray.png";
import FlagDark from "@assets/images/markers/flag-dark.png";
import PersonInfo from "@assets/images/markers/person-info.png";
import PersonPrimary from "@assets/images/markers/person-primary.png";
import PersonError from "@assets/images/markers/person-error.png";
import PersonWarning from "@assets/images/markers/person-warning.png";
import PersonGray from "@assets/images/markers/person-gray.png";
import PersonDark from "@assets/images/markers/person-dark.png";
import TruckInfo from "@assets/images/markers/truck-info.png";
import TruckPrimary from "@assets/images/markers/truck-primary.png";
import TruckError from "@assets/images/markers/truck-error.png";
import TruckWarning from "@assets/images/markers/truck-warning.png";
import TruckGray from "@assets/images/markers/truck-gray.png";
import TruckDark from "@assets/images/markers/truck-dark.png";
import WarehouseInfo from "@assets/images/markers/warehouse-info.png";
import WarehousePrimary from "@assets/images/markers/warehouse-primary.png";
import WarehouseError from "@assets/images/markers/warehouse-error.png";
import WarehouseWarning from "@assets/images/markers/warehouse-warning.png";
import WarehouseGray from "@assets/images/markers/warehouse-gray.png";
import WarehouseDark from "@assets/images/markers/warehouse-dark.png";
import type { ImageRequireSource } from "react-native";
import { colors } from "@theme";

export const images: Record<string, ImageRequireSource> = {
  "bike-info": BikeInfo,
  "bike-primary": BikePrimary,
  "bike-error": BikeError,
  "bike-warning": BikeWarning,
  "bike-gray": BikeGray,
  "bike-dark": BikeDark,
  "car-info": CarInfo,
  "car-primary": CarPrimary,
  "car-error": CarError,
  "car-warning": CarWarning,
  "car-gray": CarGray,
  "car-dark": CarDark,
  "flag-info": FlagInfo,
  "flag-primary": FlagPrimary,
  "flag-error": FlagError,
  "flag-warning": FlagWarning,
  "flag-gray": FlagGray,
  "flag-dark": FlagDark,
  "person-info": PersonInfo,
  "person-primary": PersonPrimary,
  "person-error": PersonError,
  "person-warning": PersonWarning,
  "person-gray": PersonGray,
  "person-dark": PersonDark,
  "truck-info": TruckInfo,
  "truck-primary": TruckPrimary,
  "truck-error": TruckError,
  "truck-warning": TruckWarning,
  "truck-gray": TruckGray,
  "truck-dark": TruckDark,
  "warehouse-info": WarehouseInfo,
  "warehouse-primary": WarehousePrimary,
  "warehouse-error": WarehouseError,
  "warehouse-warning": WarehouseWarning,
  "warehouse-gray": WarehouseGray,
  "warehouse-dark": WarehouseDark,
};
export const iconNames: Record<string, string> = {
  bike: "bike",
  car: "car",
  flag: "flag",
  person: "person",
  truck: "truck",
  warehouse: "warehouse",
};
export const iconColors: Record<string, string> = {
  info: colors.info,
  primary: colors.primary,
  error: colors.error,
  warning: colors.warning,
  gray: colors.iconGray,
  dark: colors.titleText,
};
