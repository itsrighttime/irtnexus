"use client";

import { createContext, useContext, type ReactNode, type JSX } from "react";

/** ------------------ TYPES ------------------ */

// You can refine this based on your tab structure
export type TabClickHandler = (tab: string) => void;

type TabsHandlerContextType = {
  tabClickHandler: TabClickHandler;
};

type TabsHandlerProviderProps = {
  children: ReactNode;
  tabClickHandler: TabClickHandler;
};

/** ------------------ CONTEXT ------------------ */

const TabsHandlerContext = createContext<TabsHandlerContextType | undefined>(
  undefined,
);

/** ------------------ PROVIDER ------------------ */

export const TabsHandlerProvider = ({
  children,
  tabClickHandler,
}: TabsHandlerProviderProps): JSX.Element => {
  return (
    <TabsHandlerContext.Provider value={{ tabClickHandler }}>
      {children}
    </TabsHandlerContext.Provider>
  );
};

/** ------------------ HOOK ------------------ */

export const useTabHandler = (): TabsHandlerContextType => {
  const context = useContext(TabsHandlerContext);

  if (!context) {
    throw new Error("useTabHandler must be used within a TabsHandlerProvider");
  }

  return context;
};
