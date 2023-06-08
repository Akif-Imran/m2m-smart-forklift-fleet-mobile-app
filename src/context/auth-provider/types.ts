import { UserData } from ".";

//TODO - User data Type should be in @api-types
export interface AuthModel extends UserData {
  token: string;
}
