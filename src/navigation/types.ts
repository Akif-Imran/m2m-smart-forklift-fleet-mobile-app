import type { NavigatorScreenParams } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";

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
  AddForklift: AddUpdateType<IForklift>;
  ForkLiftDetails: DetailsType<IForklift>;
  ReqService: undefined;
  BirdEyeView: undefined;
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
  AssignForklift: undefined;
  Activity: undefined;
  AddActivity: AddUpdateType<IDriverActivity>;
  BarcodeScanner: undefined;
  DriverCheckList: undefined;
  DriverTask: undefined;
  Notification: undefined;
  NotificationDetails: DetailsType<INotification>;
};

export type DriverStackScreenProps<T extends keyof DriversStackParamsList> =
  StackScreenProps<DriversStackParamsList, T>;
//--------------------------------------
export type ReportsStackParamsList = {
  Reports: undefined;
  CollisionReport: undefined;
  DriverPerformanceReport: undefined;
  ForkliftBreakdownReport: undefined;
  ForkliftMaintenanceReport: undefined;
  ForkliftUtilizationReport: undefined;
  OverSpeedingReport: undefined;
  IdlingReport: undefined;
  IgnitionReport: undefined;
  HistoryReport: undefined;
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
  ChangePassword: undefined;
  AddPoi: undefined;
  About: undefined;
  Help: undefined;
  ServicesStack: NavigatorScreenParams<ServiceStackParamsList>;
  ReportsStack: NavigatorScreenParams<ReportsStackParamsList>;
};

export type ProfileSettingsStackScreenProps<
  T extends keyof ProfileSettingsStackParamsList
> = StackScreenProps<ProfileSettingsStackParamsList, T>;
