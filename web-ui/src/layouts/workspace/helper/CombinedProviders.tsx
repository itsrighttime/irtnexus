"use client";

import React from "react";
import {
  AuthProvider,
  DynamicProvider,
  TabsHandlerProvider,
  type TabClickHandler,
} from "../context";

interface CombinedProvidersProps {
  children: React.ReactNode;
  tabClickHandler: TabClickHandler;
  workspace: string;
}

export const CombinedProviders: React.FC<CombinedProvidersProps> = ({
  children,
  tabClickHandler,
  workspace,
}) => (
  <AuthProvider workspace={workspace}>
    <DynamicProvider>
      <TabsHandlerProvider tabClickHandler={tabClickHandler}>
        {children}
      </TabsHandlerProvider>
    </DynamicProvider>
  </AuthProvider>
);
