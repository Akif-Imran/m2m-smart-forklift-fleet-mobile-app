import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

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
  CustomerStack: NavigatorScreenParams<CustomerStackParamsList>;
};

//--------------------------------------
export type CustomerStackParamsList = {
  CustomerList: undefined;
};

export type CustomerStackScreenProps<T extends keyof CustomerStackParamsList> = StackScreenProps<
  CustomerStackParamsList,
  T
>;
