import React from "react";
import { apiLogin } from "@services";
import { ToastService } from "@utility";

import * as authHelpers from "./AuthHelpers";

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string, save: boolean) => void;
  logout: () => void;
}

interface AuthState {
  isAuthorized: boolean;
  isLoading: boolean;
  token: string;
  user: ILoginUserData | null;
  isAdmin: boolean;
  isService: boolean;
  isDriver: boolean;
  isWarehouse: boolean;
}

type AuthAction =
  | { type: "LOGOUT" }
  | {
      type: "LOGIN";
      payload: { token: string; user: ILoginUserData; save: boolean };
    }
  | {
      type: "GIVE_ACCESS";
      payload: { isAuthorized: boolean; token: string; user: ILoginUserData };
    };

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGOUT":
      authHelpers.removeAuth().then();
      return {
        ...state,
        token: "",
        user: null,
        isAuthorized: false,
        isLoading: false,
        isAdmin: false,
        isService: false,
        isDriver: false,
        isWarehouse: false,
      };
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAdmin: action.payload.user.user_type === "Admin",
        isDriver: action.payload.user.user_type === "Driver",
        isService: action.payload.user.user_type === "Service",
        isWarehouse: action.payload.user.user_type === "Warehouse",
        isAuthorized: true,
        isLoading: false,
      };
    case "GIVE_ACCESS":
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthorized: true,
        isAdmin: action.payload.user.user_type === "Admin",
        isDriver: action.payload.user.user_type === "Driver",
        isService: action.payload.user.user_type === "Service",
        isWarehouse: action.payload.user.user_type === "Warehouse",
      };
    default:
      return state;
  }
};

const initAuthState: AuthState = {
  isAuthorized: false,
  isLoading: true, // note that this is now true
  token: "",
  user: null,
  isAdmin: false,
  isDriver: false,
  isService: false,
  isWarehouse: false,
};

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initAuthState);

  React.useEffect(() => {
    (async () => {
      try {
        const auth = await authHelpers.getAuth();
        if (!auth) {
          dispatch({ type: "LOGOUT" });
          return;
        } else {
          dispatch({
            type: "GIVE_ACCESS",
            payload: {
              isAuthorized: true,
              user: auth.user,
              token: auth.token,
            },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({ type: "LOGOUT" });
      }
    })();
  }, []);

  // React.useEffect(() => {
  //   if (state.isAuthorized) {
  //     authHelpers.setupAxios(axios);
  //   }
  // }, [state.isAuthorized]);

  const logout = React.useCallback(() => dispatch({ type: "LOGOUT" }), []);

  const login = React.useCallback(
    (email: string, password: string, save: boolean) => {
      apiLogin({ email, password })
        .then((res) => {
          ToastService.show(res?.message || "");
          if (res.success) {
            if (save) {
              authHelpers
                .setAuth({ token: res.token, user: res.data })
                .then(() => {
                  dispatch({
                    type: "LOGIN",
                    payload: { user: res.data, save: true, token: res.token },
                  });
                });
            } else {
              dispatch({
                type: "LOGIN",
                payload: { user: res.data, save: true, token: res.token },
              });
            }
          }
        })
        .catch((_err) => {
          ToastService.show("Error occurred. Try again");
        });
    },
    []
  );

  const value = React.useMemo(
    () => ({ state, login, logout }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthInitProps {
  setIsAuthLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthInit: React.FC<React.PropsWithChildren<AuthInitProps>> = ({
  children,
  setIsAuthLoaded,
}) => {
  const { state } = useAuthContext();

  React.useEffect(() => {
    if (!state.isLoading) {
      setIsAuthLoaded((_prev) => true);
    }
  }, [state.isLoading, setIsAuthLoaded]);
  return <>{children}</>;
};
//async initializers not supported by useReducer yet
/* async function initializeAuthState() {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const storedToken = await AsyncStorage.getItem("token");

    if (storedUser !== null && storedToken !== null) {
      return {
        ...initAuthState,
        user: JSON.parse(storedUser),
        token: storedToken,
        isAuthorized: true,
      };
    } else {
      return initAuthState;
    }
  } catch (error) {
    console.error(error);
    return initAuthState;
  }
} */
