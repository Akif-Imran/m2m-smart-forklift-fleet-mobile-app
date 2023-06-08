import { UserData } from ".";

export interface AuthModel extends UserData {
  token: string;
}
