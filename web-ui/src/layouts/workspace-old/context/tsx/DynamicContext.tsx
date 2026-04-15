"use client";

import {
  createContext,
  useContext,
  useState,
  type JSX,
  type ReactNode,
} from "react";

/** ------------------ TYPES ------------------ */

// Generic value type (can be refined if needed)
type DynamicState = Record<string, unknown>;

type DynamicContextType = {
  state: DynamicState;
  setValue: <T = unknown>(key: string, value: T) => void;
  removeValue: (key: string) => void;
  resetContext: () => void;
  getValue: <T = unknown>(key: string) => T | null;
};

type DynamicProviderProps = {
  children: ReactNode;
};

/** ------------------ CONTEXT ------------------ */

const DynamicContext = createContext<DynamicContextType | undefined>(undefined);

/** ------------------ PROVIDER ------------------ */

export const DynamicProvider = ({
  children,
}: DynamicProviderProps): JSX.Element => {
  const [state, setState] = useState<DynamicState>({});

  // Add or update a key-value pair
  const setValue = <T,>(key: string, value: T) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Remove a key
  const removeValue = (key: string) => {
    setState((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Reset all context values
  const resetContext = () => setState({});

  const getValue = <T,>(key: string): T | null => {
    return (state[key] as T) ?? null;
  };

  return (
    <DynamicContext.Provider
      value={{ state, setValue, removeValue, resetContext, getValue }}
    >
      {children}
    </DynamicContext.Provider>
  );
};

/** ------------------ HOOK ------------------ */

export const useDynamicContent = (): DynamicContextType => {
  const context = useContext(DynamicContext);

  if (!context) {
    throw new Error("useDynamicContent must be used within a DynamicProvider");
  }

  return context;
};
