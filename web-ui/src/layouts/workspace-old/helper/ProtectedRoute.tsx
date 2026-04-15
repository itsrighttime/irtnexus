"use client";

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context";
import { Loading } from "@/atoms";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

interface AuthState {
  loading: boolean;
  authorized: boolean;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  children,
}) => {
  const { userDetails } = useAuth();

  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    authorized: false,
  });

  useEffect(() => {
    const checkAuthorization = () => {
      if (userDetails) {
        setAuthState({ loading: false, authorized: true });
      } else {
        setAuthState({ loading: false, authorized: false });
      }
    };

    checkAuthorization();
  }, [userDetails]);

  if (authState.loading) {
    return <Loading />;
  }

  if (!authState.authorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
