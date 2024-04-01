import { ReactNode, createContext, useContext, useState } from "react";

type authContextType = {
  isAuth: boolean;
  onChangeAuth: (isAuth: boolean) => void;
  username: string | undefined;
  onChangeUsername: (username: string | undefined) => void;
  logout: () => void;
};

const authContextDefaultValues: authContextType = {
  isAuth: false,
  onChangeAuth: (isAuth: boolean): void => {},
  username: undefined,
  onChangeUsername: (username: string | undefined): void => {},
  logout: (): void => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: ReactNode;
  values?: {
    isAuth: boolean;
    username: string | undefined;
  };
};

export function AuthProvider({ children, values }: Props) {
  const [isAuth, setAuth] = useState(!!values?.isAuth);
  const [username, setUsername] = useState<string | undefined>(
    values?.username || undefined
  );

  const onChangeAuth = (isAuth: boolean): void => {
    setAuth(isAuth);
  };

  const onChangeUsername = (username: string | undefined): void => {
    setUsername(username);
  };

  const logout = (): void => {
    setUsername(undefined);
    setAuth(false);
  };

  const value = {
    username,
    onChangeUsername,
    isAuth,
    onChangeAuth,
    logout,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
