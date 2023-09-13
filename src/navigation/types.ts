import type { NavigatorScreenParams } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { LatLng } from "react-native-maps";

type DetailsType<T> = {
  item: T;
  _id: string;
};

type AddUpdateType<T> =
  | {
      mode: "add";
    }
  | {
      mode: "edit";
      item: T;
      _id: string;
    };

//--------------------------------------
export type AuthStackParamsList = {
  RootTabs: NavigatorScreenParams<MainTabsParamsList>;
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamsList> =
  StackScreenProps<AuthStackParamsList, T>;

//--------------------------------------
export type MainTabsParamsList = {
  DashboardStack: NavigatorScreenParams<DashboardStackParamsList>;
  ForkliftStack: NavigatorScreenParams<ForkliftStackParamsList>;
  // ServicesStack: NavigatorScreenParams<ServiceStackParamsList>;
  DriversStack: NavigatorScreenParams<DriversStackParamsList>;
  // ReportsStack: NavigatorScreenParams<ReportsStackParamsList>;
  ProfileSettingsStack: NavigatorScreenParams<ProfileSettingsStackParamsList>;
};

//--------------------------------------
export type DashboardStackParamsList = {
  Dashboard: undefined;
};

export type DashboardStackScreenProps<
  T extends keyof DashboardStackParamsList
> = StackScreenProps<DashboardStackParamsList, T>;
//--------------------------------------
export type ForkliftStackParamsList = {
  Forklift: undefined;
  AddForklift: AddUpdateType<IVehicle>;
  ForkLiftDetails: DetailsType<IVehicle>;
  ReqService: undefined;
  BirdEyeView:
    | {
        mode: "single";
        deviceId: number;
      }
    | { mode: "multiple" };
  Fences: DetailsType<IVehicle>;
  Trips: DetailsType<IVehicle>;
  Playback: {
    tripLine: LatLng[];
    tripDetails: ITripDetail[];
    vehicle: DetailsType<IVehicle>;
  };
  BarcodeScanner: undefined;
  DriverCheckList: DetailsType<QRScanDeviceDetails>;
  DriverTask: undefined;
  ReportsStack: NavigatorScreenParams<ReportsStackParamsList>;
  Notification: undefined;
  NotificationDetails: DetailsType<INotification>;
};

export type ForkliftStackScreenProps<T extends keyof ForkliftStackParamsList> =
  StackScreenProps<ForkliftStackParamsList, T>;
//--------------------------------------
export type ServiceStackParamsList = {
  Services: undefined;
  AddService: AddUpdateType<IService>;
  ServiceDetails: DetailsType<IService>;
  // UpdateStatus: DetailsType<IService>;
  Notification: undefined;
  NotificationDetails: DetailsType<INotification>;
};

export type ServiceStackScreenProps<T extends keyof ServiceStackParamsList> =
  StackScreenProps<ServiceStackParamsList, T>;
//--------------------------------------
export type DriversStackParamsList = {
  Drivers: undefined;
  DriverDetails: DetailsType<IDriver>;
  AddDriver: AddUpdateType<IDriver>;
  AssignForklift: DetailsType<IDriver>;
  Activity: DetailsType<IDriver>;
  AddActivity: AddUpdateType<IDriverActivity>;
  BarcodeScanner: undefined;
  DriverCheckList: DetailsType<QRScanDeviceDetails>;
  DriverTask: undefined;
  Notification: undefined;
  NotificationDetails: DetailsType<INotification>;
};

export type DriverStackScreenProps<T extends keyof DriversStackParamsList> =
  StackScreenProps<DriversStackParamsList, T>;
//--------------------------------------
export type ReportsStackParamsList = {
  Reports: {
    vehicleId: number;
    deviceId: number;
  };
  CollisionReport: undefined;
  DriverPerformanceReport: undefined;
  ForkliftBreakdownReport: undefined;
  ForkliftMaintenanceReport: undefined;
  ForkliftUtilizationReport: undefined;
  OverSpeedingReport: undefined;
  IdlingReport: undefined;
  IgnitionReport: {
    vehicleId: number;
    deviceId: number;
  };
  HistoryReport: {
    vehicleId: number;
    deviceId: number;
  };
  ViewOnMap: {
    location: CoordinatesType;
    name: string;
  };
  Notification: undefined;
  NotificationDetails: DetailsType<INotification>;
};

export type ReportStackScreenProps<T extends keyof ReportsStackParamsList> =
  StackScreenProps<ReportsStackParamsList, T>;
//--------------------------------------
export type ProfileSettingsStackParamsList = {
  Settings: undefined;
  Checklist: undefined;
  ChangePassword: undefined;
  VehicleIcons: undefined;
  SelectIcon: DetailsType<IVehicle>;
  Pois: undefined;
  ViewPoiOnMap: DetailsType<IPOI>;
  About: undefined;
  Help: undefined;
  ServicesStack: NavigatorScreenParams<ServiceStackParamsList>;
  ReportsStack: NavigatorScreenParams<ReportsStackParamsList>;
  DriverWorkingTime: undefined;
};

export type ProfileSettingsStackScreenProps<
  T extends keyof ProfileSettingsStackParamsList
> = StackScreenProps<ProfileSettingsStackParamsList, T>;
