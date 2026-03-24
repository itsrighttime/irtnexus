import { TextInput } from "@/atoms";
import { useState } from "react";

export const TestTextInput = () => {
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (val: string) => {
    if (!val.includes("@")) {
      setError("Invalid email address");
    } else {
      setError("");
    }
    setEmail(val);
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      {/* Basic */}
      <section>
        <h3>Basic</h3>
        <TextInput
          color="red"
          radius="none"
          variant="underline"
          placeholder="Enter text"
        />
      </section>

      {/* With Label */}
      <section>
        <h3>With Label</h3>
        <TextInput label="Username" placeholder="Enter username" />
      </section>

      {/* Controlled */}
      <section>
        <h3>Controlled</h3>
        <TextInput
          label="Controlled Input"
          value={value}
          onChange={(v) => setValue(v)}
        />
        <div>Value: {value}</div>
      </section>

      {/* Variants */}
      <section>
        <h3>Variants</h3>
        <TextInput variant="outline" placeholder="Outline" />
        <TextInput variant="filled" placeholder="Filled" />
        <TextInput variant="ghost" placeholder="Ghost" />
      </section>

      {/* Sizes */}
      <section>
        <h3>Sizes</h3>
        <TextInput size="small" placeholder="Small" />
        <TextInput size="medium" placeholder="Medium" />
        <TextInput size="large" placeholder="Large" />
      </section>

      {/* With Icons */}
      <section>
        <h3>With Icons</h3>
        <TextInput placeholder="Search..." iconLeft={<span>🔍</span>} />
        <TextInput placeholder="Enter amount" iconRight={<span>₹</span>} />
      </section>

      {/* States */}
      <section>
        <h3>States</h3>
        <TextInput placeholder="Disabled" disabled />
        <TextInput placeholder="Loading" loading />
      </section>

      {/* Error + Helper */}
      <section>
        <h3>Validation</h3>
        <TextInput
          label="Email"
          value={email}
          onChange={(e) => validateEmail(e)}
          error={error}
          helperText="We’ll never share your email"
        />
      </section>

      {/* Block */}
      <section>
        <h3>Block</h3>
        <TextInput block placeholder="Full width input" />
      </section>

      {/* Custom Color */}
      <section>
        <h3>Custom Color</h3>
        <TextInput placeholder="Custom color" color="#8a244b" />
      </section>

      {/* Password */}
      <section>
        <h3>Password</h3>
        <TextInput type="password" placeholder="Enter password" />
      </section>
    </div>
  );
};
