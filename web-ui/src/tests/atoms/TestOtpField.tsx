import React, { useState } from "react";
import { OtpField } from "@/atoms";

export const TestOtpField: React.FC = () => {
  const [numericOtp, setNumericOtp] = useState<string | null>(null);
  const [alphaOtp, setAlphaOtp] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-family)" }}>
      <h2>OTP Field Test</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3>Numeric OTP (6 digits)</h3>
        <OtpField
          length={6}
          color="#1E90FF"
        //   width="250px"
          userId="user123"
          verificationEndpoint="/api/verify-otp"
          setResult={setNumericOtp}
          setError={setErrorMsg}
          isNumeric={true}
        />
        <p>Entered OTP: {numericOtp || "None"}</p>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3>Alphanumeric OTP (8 characters)</h3>
        <OtpField
          length={8}
          color="#FF69B4"
          width="300px"
          userId="user456"
          verificationEndpoint="/api/verify-otp"
          setResult={setAlphaOtp}
          setError={setErrorMsg}
          isNumeric={false}
        />
        <p>Entered OTP: {alphaOtp || "None"}</p>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            setNumericOtp(null);
            setAlphaOtp(null);
            setErrorMsg("");
          }}
          style={{
            padding: "8px 16px",
            borderRadius: "5px",
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reset OTPs
        </button>
      </div>
    </div>
  );
};