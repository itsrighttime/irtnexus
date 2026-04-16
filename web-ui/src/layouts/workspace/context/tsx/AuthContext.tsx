"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  type JSX,
} from "react";
import { login } from "../helper/login.js";
import { logout } from "../helper/logout.js";
import { checkSession } from "../helper/checkSession.js";
import { useNavigate } from "react-router-dom";
import type { ScreenTypeValue } from "../../tsx/WorkspaceLayoutWrapper.js";

/** ------------------ TYPES ------------------ */

type User = {
  userId: string;
  name: string;
  role: string;
  screenType: ScreenTypeValue;
};

type UserDetails = {
  user: User;
} | null;

type AuthContextType = {
  userDetails: UserDetails;
  handleLogin: (credentials: Record<string, unknown>) => Promise<void>;
  handleLogout: () => Promise<void>;
  loading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
  workspace: string;
};

/** ------------------ CONTEXT ------------------ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** ------------------ PROVIDER ------------------ */

export const AuthProvider = ({
  children,
  workspace,
}: AuthProviderProps): JSX.Element => {
  const [userDetails, setUserDetails] = useState<UserDetails>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleLogin = async (credentials: Record<string, unknown>) => {
    await login({ setUserDetails, credentials, navigate, workspace });
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    await logout({ setUserDetails, navigate });
  };

  useEffect(() => {
    checkSession(setUserDetails, setLoading);
  }, []);

  return (
    <AuthContext.Provider
      value={{ userDetails, handleLogin, handleLogout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

/** ------------------ HOOK ------------------ */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
