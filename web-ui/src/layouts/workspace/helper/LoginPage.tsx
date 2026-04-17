"use client";

import React from "react";
import { getProductLogo, IMAGE_ASSETS_KEYS } from "@/assets";
import { useAuth } from "../context";

interface LoginPageProps {
  handleToggleFullscreen?: (() => void) | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  handleToggleFullscreen = null,
}) => {
  const { handleLogin } = useAuth();
  const irtLogo = getProductLogo(IMAGE_ASSETS_KEYS.itsrighttime);
  // return (
  //   <LoginForm
  //     handleLogin={handleLogin}
  //     handleToggleFullscreen={handleToggleFullscreen}
  //     handleForgotId={() => {
  //       console.warn("Currently not Implemented");
  //     }}
  //     handleForgotPassword={() => {
  //       console.warn("Currently not Implemented");
  //     }}
  //     formIcon={irtLogo}
  //   />
  // );

  return <div>Login Page need to be implemented</div>;
};
