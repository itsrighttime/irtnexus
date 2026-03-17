import { Button } from "@/atoms";

export type AtomComponents = {
  Button: typeof Button;
  // Add more implemented atoms here:
  // TextInput: typeof TextInput;
  // Badge: typeof Badge;
};

export const ATOM_COMPONENT_MAP: {
  [K in keyof AtomComponents]: AtomComponents[K];
} = {
  Button,
  // Add more here as implemented
};
