"use client";

import { getProductLogo, IMAGE_ASSETS_KEYS } from "@/assets";
import { LoginForm } from "./LoginForm";

export const PageLogin = () => {
  const handleLogin = async (id: string, password: string) => {
    console.log("Ligin User", id, password);
  };

  const irtLogo = getProductLogo(IMAGE_ASSETS_KEYS.itsrighttime);
  return (
    <LoginForm
      handleLogin={handleLogin}
      // handleRegister={() => {}}
      handleForgotId={() => {
        console.warn("Currently not Implemented");
      }}
      handleForgotPassword={() => {
        console.warn("Currently not Implemented");
      }}
      formIcon={irtLogo}
      // errorMsg="This is an error"
    />
  );
};
