import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

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
export type AuthStackScreenProps<T extends keyof AuthStackParamsList> = StackScreenProps<
  AuthStackParamsList,
  T
>;
//--------------------------------------
export type MainTabsParamsList = {
  DashboardStack: NavigatorScreenParams<DashboardStackParamsList>;
  ForkliftStack: NavigatorScreenParams<ForkliftStackParamsList>;
  ProfileSettingsStack: NavigatorScreenParams<ProfileSettingsStackParamsList>;
};

//--------------------------------------
export type DashboardStackParamsList = {
  Dashboard: undefined;
};

export type DashboardStackScreenProps<T extends keyof DashboardStackParamsList> = StackScreenProps<
  DashboardStackParamsList,
  T
>;
//--------------------------------------
export type ForkliftStackParamsList = {
  Forklift: undefined;
  AddForklift: AddUpdateType<IForklift>
  ForkLiftDetails: DetailsType<IForklift>;
  ReqService: undefined;
};

export type ForkliftStackScreenProps<T extends keyof ForkliftStackParamsList> = StackScreenProps<
  ForkliftStackParamsList,
  T
>;
//--------------------------------------
export type ProfileSettingsStackParamsList = {
  Settings: undefined;
  ChangePassword: undefined;
  About: undefined;
  Help: undefined;
};

export type ProfileSettingsStackScreenProps<T extends keyof ProfileSettingsStackParamsList> =
  StackScreenProps<ProfileSettingsStackParamsList, T>;
