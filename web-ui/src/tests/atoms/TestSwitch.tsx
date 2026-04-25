import React, { useState } from "react";
import { Switch } from "@/atoms";

export const TestSwitch: React.FC = () => {
  const [notifications, setNotifications] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(false);

  return (
    <div style={{ padding: "40px", fontFamily: "var(--font-family)" }}>
      <h2>Switch Component Test</h2>

      {/* Basic Switch */}
      <div style={{ marginBottom: "30px" }}>
        <Switch
          label="Enable Notifications"
          value={notifications}
          setResult={setNotifications}
          color="#1E90FF"
          required
        />
        <p>Status: {notifications ? "ON" : "OFF"}</p>
      </div>

      {/* Pre-enabled Switch */}
      <div style={{ marginBottom: "30px" }}>
        <Switch
          label="Dark Mode"
          value={darkMode}
          setResult={setDarkMode}
          color="#333"
        />
        <p>Status: {darkMode ? "Enabled" : "Disabled"}</p>
      </div>

      {/* Disabled Switch */}
      <div style={{ marginBottom: "30px" }}>
        <Switch
          label="Auto Save (Disabled)"
          value={autoSave}
          setResult={setAutoSave}
          color="#28a745"
          disabled
        />
        <p>Status: {autoSave ? "ON" : "OFF"}</p>
      </div>

      {/* Custom Styled Switch */}
      <div style={{ marginBottom: "30px" }}>
        <Switch
          label="Custom Styled Switch"
          value={true}
          setResult={(val) => console.log("Custom Switch:", val)}
          color="#FF69B4"
          customStyles={{
            container: { gap: "12px", alignItems: "center" },
            label: { fontWeight: "600", color: "#FF69B4" },
          }}
        />
      </div>

      {/* Multiple Switches Inline */}
      <div style={{ marginBottom: "30px" }}>
        <h4>Inline Switches</h4>
        <div style={{ display: "flex", gap: "20px" }}>
          <Switch
            label="A"
            value={false}
            setResult={(val) => console.log("A:", val)}
            color="#00b894"
          />
          <Switch
            label="B"
            value={true}
            setResult={(val) => console.log("B:", val)}
            color="#e17055"
          />
          <Switch
            label="C"
            value={false}
            setResult={(val) => console.log("C:", val)}
            color="#6c5ce7"
          />
        </div>
      </div>
    </div>
  );
};
