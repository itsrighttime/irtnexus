"use client";

import { Dropdown, type DropdownProps } from "./Dropdown";

export type SingleDropdownProps = Omit<
  DropdownProps,
  "multiple" | "value" | "setResult"
> & {
  value?: string;
  setResult: (value: string) => void;
};

export const SingleDropdown: React.FC<SingleDropdownProps> = ({
  value,
  setResult,
  ...props
}) => {
  return (
    <Dropdown
      {...props}
      multiple={false}
      value={value ? [value] : []}
      setResult={(res) => setResult(res[0] || "")}
    />
  );
};

export type MultipleDropdownProps = Omit<DropdownProps, "multiple">;

export const MultipleDropdown: React.FC<MultipleDropdownProps> = (props) => {
  return <Dropdown {...props} multiple />;
};
