"use client";

import React, { useState } from "react";
import styles from "../css/LockScreen.module.css";
import { useAuth } from "../context";
import { Button, OtpField } from "@/atoms";

interface LockScreenProps {
  handleForgot?: () => void;
  handleUnlock: (value: string | null) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  handleForgot,
  handleUnlock,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { userDetails } = useAuth();

  if (!userDetails) return <></>;

  const handleSubmit = (value: string | null) => {
    handleUnlock(value);
  };

  return (
    <div className={styles.lockScreen}>
      <OtpField
        setResult={handleSubmit}
        verificationEndpoint={"/verify-otp"}
        userId={userDetails.user.userId}
        setError={setError}
        isNumeric={false}
      />
      {error ? (
        <p className={styles.errorText}>Aahh!, Your bad try again</p>
      ) : (
        <p className={styles.text}>
          Enter Your<span className={styles.magicText}> Magic Phrase</span>,{" "}
          <Button variant="tertiary" onClick={handleForgot}>
            Opps! I forgot it
          </Button>
        </p>
      )}
    </div>
  );
};
