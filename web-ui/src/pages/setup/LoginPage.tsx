"use client";

import { useState } from "react";
import styles from "./LoginForm.module.css";
import { IconButton } from "@/atoms";
import { Icons } from "@/assets";

/* -------------------- Types -------------------- */

type ExtraButtonsProps = {
  handleForgotId?: (() => void) | null;
  handleForgotPassword?: (() => void) | null;
};

type LoginFormProps = {
  handleToggleFullscreen?: (() => void) | null;
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
  handleToggleFullscreen = null,
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
      {handleToggleFullscreen && (
        <div className={styles.extraIcons}>
          <IconButton
            icon={Icons.screenModeIcon}
            label={workspaceLabels.toggleFullscreen}
            onClick={handleToggleFullscreen}
            size={1.2}
            color="var(--colorRed)"
          />
        </div>
      )}

      <div className={styles.loginForm}>
        <div className={styles.formMeta}>
          {formIcon && (
            <img src={formIcon} className={styles.formIcon} alt="form icon" />
          )}
          <p className={styles.title}>{formTitle}</p>
        </div>

        <div className={styles.inputs}>
          <TextField
            label="Any Valid Id"
            placeholder="Any Valid Id"
            setResult={setId}
          />
          <PasswordField setResult={setPassword} />
        </div>

        <div className={styles.buttonsWrapper}>
          <div className={styles.buttons}>
            <Button text="Login" onClick={() => handleLogin(id, password)} />

            {handleRegister ? (
              <Button
                text="Register"
                onClick={handleRegister}
                isBackground={false}
              />
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
        </div>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      </div>
    </div>
  );
};
