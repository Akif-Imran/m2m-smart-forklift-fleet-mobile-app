import React from "react";
import * as authHelpers from "./AuthHelpers";
import axios from "axios";

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string, save: boolean) => void;
  logout: () => void;
}

interface UserData {
  name: string;
  email: string;
}

interface AuthState {
  isAuthorized: boolean;
  isLoading: boolean;
  token: string;
  user: UserData | null;
}

type AuthAction =
  | { type: "LOGOUT" }
  | { type: "LOGIN"; payload: { email: string; password: string; save: boolean } }
  | { type: "GIVE_ACCESS"; payload: { isAuthorized: boolean; token: string; user: UserData } };

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGOUT":
      authHelpers.removeAuth().then();
      return { ...state, token: "", user: null, isAuthorized: false, isLoading: false };
    case "LOGIN":
      const u = { email: action.payload.email, name: "John Doe", token: "secure-token" };
      return {
        ...state,
        token: u.token,
        user: { name: u.name, email: u.email },
        isAuthorized: true,
        isLoading: false,
      };
    case "GIVE_ACCESS":
      return { ...state, ...action.payload, isLoading: false, isAuthorized: true };
    default:
      return state;
  }
};

const initAuthState: AuthState = {
  isAuthorized: false,
  isLoading: true, // note that this is now true
  token: "",
  user: null,
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
              user: { name: auth.name, email: auth.email },
              token: auth.token,
            },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({ type: "LOGOUT" });
      }
    })();

    return () => {};
  }, []);

  React.useEffect(() => {
    if (state.isAuthorized) {
      authHelpers.setupAxios(axios);
    }
  }, [state.isAuthorized]);

  const logout = React.useCallback(() => dispatch({ type: "LOGOUT" }), []);
  const login = React.useCallback(
    (email: string, password: string, save: boolean) =>
      dispatch({ type: "LOGIN", payload: { email, password, save } }),
    []
  );

  const value = React.useMemo(() => ({ state, login, logout }), [state, login, logout]);

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
      setIsAuthLoaded((prev) => true);
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
