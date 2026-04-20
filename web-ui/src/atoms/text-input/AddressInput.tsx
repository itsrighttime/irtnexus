import React from "react";
import { TextInput } from "./TextInput";

export type AddressValue = {
  house?: string;
  street?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  addressLine?: string;
  landmark?: string;
};

export type AddressInputProps = {
  value?: AddressValue;
  setResult?: (value: AddressValue) => void;

  isHouse?: boolean;
  isStreet?: boolean;
  isCity?: boolean;
  isState?: boolean;
  isPostal?: boolean;
  isCountry?: boolean;
  isAddressLine?: boolean;
  isLandmark?: boolean;

  disabled?: boolean;
  loading?: boolean;
};

export const AddressInput: React.FC<AddressInputProps> = ({
  value = {},
  setResult,

  isHouse = false,
  isStreet = false,
  isCity = false,
  isState = false,
  isPostal = false,
  isCountry = false,
  isAddressLine = false,
  isLandmark = false,

  disabled,
  loading,
}) => {
  const updateField = (key: keyof AddressValue, val: string) => {
    const updated = { ...value, [key]: val };
    setResult?.(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {isAddressLine && (
        <TextInput
          label="Address Line"
          value={value.addressLine || ""}
          onChange={(val) => updateField("addressLine", val)}
          disabled={disabled}
          loading={loading}
        />
      )}

      {isHouse && (
        <TextInput
          label="House / Flat No."
          value={value.house || ""}
          onChange={(val) => updateField("house", val)}
          disabled={disabled}
          loading={loading}
        />
      )}

      {isStreet && (
        <TextInput
          label="Street"
          value={value.street || ""}
          onChange={(val) => updateField("street", val)}
          disabled={disabled}
          loading={loading}
        />
      )}

      {isLandmark && (
        <TextInput
          label="Landmark"
          value={value.landmark || ""}
          onChange={(val) => updateField("landmark", val)}
          disabled={disabled}
          loading={loading}
        />
      )}

      {isCity && (
        <TextInput
          label="City"
          value={value.city || ""}
          onChange={(val) => updateField("city", val)}
          disabled={disabled}
          loading={loading}
        />
      )}

      {isState && (
        <TextInput
          label="State"
          value={value.state || ""}
          onChange={(val) => updateField("state", val)}
          disabled={disabled}
          loading={loading}
        />
      )}

      {isPostal && (
        <TextInput
          label="Postal Code"
          textType="number"
          value={value.postal || ""}
          onChange={(val) => updateField("postal", val)}
          disabled={disabled}
          loading={loading}
        />
      )}

      {isCountry && (
        <TextInput
          label="Country"
          value={value.country || ""}
          onChange={(val) => updateField("country", val)}
          disabled={disabled}
          loading={loading}
        />
      )}
    </div>
  );
};
