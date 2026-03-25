"use client";

import { Dropdown } from "./Dropdown";

type SingleDropdownProps = Omit<
  React.ComponentProps<typeof Dropdown>,
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

type MultipleDropdownProps = Omit<
  React.ComponentProps<typeof Dropdown>,
  "multiple"
>;

export const MultipleDropdown: React.FC<MultipleDropdownProps> = (props) => {
  return <Dropdown {...props} multiple />;
};
