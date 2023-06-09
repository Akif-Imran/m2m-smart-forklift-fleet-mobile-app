import React, { createContext, useContext, Dispatch, useState } from "react";
import * as authHelpers from "./AuthHelpers";
import axios from "axios";

interface AuthContextType {
  isAuthorized: boolean;
  isLoading: boolean;
  token: string;
  user: UserData | null;
  logout: () => void;
  login: (email: string, password: string, save: boolean) => void;
  giveAccess: (isAuthorized: boolean, token: string, user: UserData) => void;
}
const initAuthContext: AuthContextType = {
  isAuthorized: false,
  isLoading: false,
  token: "",
  user: null,
  logout: () => {},
  login: (email: string, password: string, save: boolean) => {},
  giveAccess: (isAuthorized: boolean, token: string, user: UserData) => {},
};

const AuthContext = createContext<AuthContextType>(initAuthContext);

export type UserData = {
  name: string;
  email: string;
};

interface OwnProps {}

const AuthProvider: React.FC<React.PropsWithChildren<OwnProps>> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = (): void => {
    authHelpers.removeAuth().then(() => {
      setToken("");
      setUser(null);
      setIsAuthorized(false);
    });
  };

  const login = (email: string, password: string, save: boolean) => {
    var data = JSON.stringify({
      email,
      password,
    });
    const u = { email, name: "John Doe", token: "secure-token" };
    setIsLoading(true);
    authHelpers
      .setAuth(u)
      .then(() => {
        authHelpers.setupAxios(axios);
        giveAccess(true, u.token, u);
      })
      .catch((err) => {
        console.log("Auth Provider (login) =>", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const giveAccess = (isAuthorized: boolean, token: string, user: UserData) => {
    setIsAuthorized((prev) => isAuthorized);
    setToken((prev) => token);
    setUser((prev) => user);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        isLoading,
        token,
        user,
        logout,
        login,
        giveAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);

interface AuthInitProps {
  setIsAuthLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthInit: React.FC<React.PropsWithChildren<AuthInitProps>> = ({
  children,
  setIsAuthLoaded,
}) => {
  const { giveAccess } = useAuthContext();

  React.useEffect(() => {
    const requestAuth = async () => {
      const user = await authHelpers.getAuth();
      if (user) {
        //TODO - remove this and used useReducer Approach for auth context, then convert to Redux
        giveAccess(true, user.token, user);
      }
    };

    requestAuth()
      .catch((err) => {
        console.log(err.message);
        console.log("Auth Init Error");
      })
      .finally(() => {
        setIsAuthLoaded(true);
      });
  }, []);
  return <>{children}</>;
};
