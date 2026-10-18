import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../interfaces/user";
import { useQuery } from "@tanstack/react-query";
import { getMyProfileInfo, } from "../service/profile.service";
import { jwtDecode } from "jwt-decode";

interface AuthProviderType {
  token: string | null;
  isAuthenticated: boolean;
  saveUserToken: (token: string) => void;
  removeUserToken: () => void;
  currentUser: User | null;
  currentUserId:string
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthProviderType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");


  const { data} = useQuery({
    queryKey: ["profile", currentUserId],
    queryFn: () => getMyProfileInfo(token),
    select: (data) => data.data.data.user,
    enabled: !!currentUserId,
  });

  useEffect(() => {
    if (data) {
      setCurrentUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (!token) {
      setCurrentUserId("");
      return;
    }
    try {
      const { user } = jwtDecode<{ user: string }>(token);
      setCurrentUserId(user);
    } catch (error) {
      setCurrentUserId("");
    }
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("use_token");
    if (storedToken) {
      setToken(storedToken);
    }
    return () => {};
  }, []);

  const isAuthenticated = Boolean(token);

  const saveUserToken = (token: string): void => {
    setToken(token);
    localStorage.setItem("use_token", token);
  };

  const removeUserToken = (): void => {
    setToken(null);
    localStorage.removeItem("use_token");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        saveUserToken,
        removeUserToken,
        isAuthenticated,
        currentUser,
        currentUserId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
};
