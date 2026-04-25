"use client";

import { useState } from "react";
import styles from "./LoginForm.module.css";
import { Button, PasswordInput, PlainButton, TextInput } from "@/atoms";

/* -------------------- Types -------------------- */

type ExtraButtonsProps = {
  handleForgotId?: (() => void) | null;
  handleForgotPassword?: (() => void) | null;
};

type LoginFormProps = {
  handleForgotId?: (() => void) | null;
  handleForgotPassword?: (() => void) | null;
  handleRegister?: (() => void) | null;
  handleLogin?: (id: string, password: string) => void;
  formTitle?: string;
  formIcon?: string | null;
  errorMsg?: string;
};

/* -------------------- Components -------------------- */

const ExtraButtons: React.FC<ExtraButtonsProps> = ({
  handleForgotId,
  handleForgotPassword,
}) => (
  <div className={styles.extra}>
    {handleForgotId && (
      <PlainButton
        text="Oops! I forgot my ID"
        color="var(--colorGray4)"
        onClick={handleForgotId}
      />
    )}
    {handleForgotPassword && (
      <PlainButton
        text="Ahh! I forgot my password"
        color="var(--colorGray4)"
        onClick={handleForgotPassword}
      />
    )}
  </div>
);

export const LoginForm: React.FC<LoginFormProps> = ({
  handleForgotId = null,
  handleForgotPassword = null,
  handleRegister = null,
  handleLogin = (id: string, password: string) => {
    console.warn("handleLogin prop not provided", { id, password });
  },
  formTitle = "Welcome Back",
  formIcon = null,
  errorMsg = "",
}) => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className={styles.loginFormWrapper}>
      <div className={styles.loginForm}>
        <div className={styles.formMeta}>
          {formIcon && (
            <img src={formIcon} className={styles.formIcon} alt="form icon" />
          )}
          <p className={styles.title}>{formTitle}</p>
        </div>

        <div className={styles.inputs}>
          <TextInput
            label="Any Valid Id"
            placeholder="Any Valid Id"
            setResult={setId}
            variant={"underline"}
            radius={"none"}
            width="100%"
          />
          <PasswordInput
            placeholder="Password"
            setResult={setPassword}
            variant={"underline"}
            width="100%"
            radius={"none"}
          />
        </div>

        <div className={styles.buttonsWrapper}>
          <div className={styles.buttons}>
            <Button variant="primary" onClick={() => handleLogin(id, password)}>
              Login
            </Button>

            {handleRegister ? (
              <Button variant="secondary" onClick={handleRegister}>
                Register
              </Button>
            ) : (
              <ExtraButtons
                handleForgotId={handleForgotId}
                handleForgotPassword={handleForgotPassword}
              />
            )}
          </div>

          {handleRegister && (
            <ExtraButtons
              handleForgotId={handleForgotId}
              handleForgotPassword={handleForgotPassword}
            />
          )}

          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
};
