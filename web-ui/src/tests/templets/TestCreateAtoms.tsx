import { ATOMS, createAtom, PRESETS } from "@/templates";

// Primary button uses default sub-preset
const PrimaryButton = createAtom(ATOMS.BUTTON, PRESETS.BUTTON.A.PRIMARY);

// Primary button small
const PrimaryButtonSmall = createAtom(
  ATOMS.BUTTON,
  PRESETS.BUTTON.A.PRIMARY,
  PRESETS.BUTTON.B.SMALL,
);

// Secondary button
const SecondaryButton = createAtom(ATOMS.BUTTON, PRESETS.BUTTON.A.SECONDARY);

// Usage

export const TestCreateAtoms = () => {
  return (
    <div>
      <PrimaryButton onClick={() => alert("Clicked")}>Click Me</PrimaryButton>
      <PrimaryButtonSmall>Small Button</PrimaryButtonSmall>
      <SecondaryButton>Cancel</SecondaryButton>
    </div>
  );
};
