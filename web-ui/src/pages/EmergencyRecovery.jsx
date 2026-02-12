import React, { useState } from "react";
import {
  AlertOctagon,
  Lock,
  RefreshCw,
  LogOut,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import styles from "./EmergencyRecovery.module.css";

export const EmergencyRecovery = () => {
  const [wizardStep, setWizardStep] = useState(0);
  const [accountFrozen, setAccountFrozen] = useState(false);

  const handleFreeze = () => {
    if (
      confirm(
        "Are you sure you want to freeze your account? All active sessions will be terminated immediately.",
      )
    ) {
      setAccountFrozen(true);
      alert("Account Frozen. All sessions terminated.");
    }
  };

  const handleRecovery = () => {
    if (wizardStep < 3) {
      setWizardStep((prev) => prev + 1);
    } else {
      alert("Recovery Process Initiated. Check your email.");
      setWizardStep(0);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Emergency & Recovery</h1>
          <p className={styles.pageSubtitle}>
            Critical actions for account security and recovery.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Panic Button / Freeze */}
        <Card className={styles.dangerCard}>
          <CardHeader>
            <CardTitle className={styles.dangerTitle}>
              <AlertOctagon size={24} /> Panic Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.dangerText}>
              If you suspect your account is compromised, you can immediately
              freeze all access. This will sign out all devices and block new
              logins until you verify your identity.
            </p>
            <Button
              variant="danger"
              className={styles.freezeBtn}
              onClick={handleFreeze}
              disabled={accountFrozen}
            >
              {accountFrozen
                ? "Account Frozen"
                : "Freeze Account & Terminate Sessions"}
            </Button>
          </CardContent>
        </Card>

        {/* Recovery Wizard */}
        <Card className={styles.recoveryCard}>
          <CardHeader>
            <CardTitle>Account Recovery Wizard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.stepper}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`${styles.step} ${wizardStep >= step ? styles.completedStep : wizardStep === step - 1 ? styles.activeStep : ""}`}
                >
                  {wizardStep >= step ? <CheckCircle size={16} /> : step}
                </div>
              ))}
            </div>

            <div className={styles.wizardContent}>
              {wizardStep === 0 && (
                <>
                  <h3>Step 1: Verify Identity</h3>
                  <p>
                    We need to confirm it's really you. Choosing a recovery
                    method...
                  </p>
                  <Button onClick={handleRecovery}>Send Code to Email</Button>
                </>
              )}
              {wizardStep === 1 && (
                <>
                  <h3>Step 2: Enter Code</h3>
                  <p>
                    Please enter the 6-digit code sent to your backup email.
                  </p>
                  <input
                    type="text"
                    placeholder="000000"
                    className={styles.codeInput}
                  />
                  <Button onClick={handleRecovery}>Verify Code</Button>
                </>
              )}
              {wizardStep === 2 && (
                <>
                  <h3>Step 3: Reset Security</h3>
                  <p>
                    Success! You can now reset your password and review recent
                    activity.
                  </p>
                  <Button onClick={handleRecovery}>Reset Password</Button>
                </>
              )}
              {wizardStep === 3 && (
                <div className={styles.successMessage}>
                  <CheckCircle size={48} className={styles.successIcon} />
                  <h3>Recovery Complete</h3>
                  <Button variant="secondary" onClick={() => setWizardStep(0)}>
                    Done
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
