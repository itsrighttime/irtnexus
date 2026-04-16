"use client";

// Workspace.tsx
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CombinedProviders } from "../helper/CombinedProviders.js";
import { WorkspaceLayoutWrapper } from "./WorkspaceLayoutWrapper.js";
import { WorkspaceHomePage } from "./WorspaceHomePage.js";
import { FullscreenWrapper } from "./FullscreenWrapper.js";
import { LoginPage } from "../helper/LoginPage.js";
import { ErrorPage } from "@/atoms/index.js";

interface WorkspaceProps {
  tabClickHandler?: (value: string) => void;
  workspace?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  tabClickHandler = () => {},
  workspace = "letsDiscuss",
}) => {
  const navigate = useNavigate();

  return (
    <CombinedProviders tabClickHandler={tabClickHandler} workspace={workspace}>
      <FullscreenWrapper>
        {({ toggleFullscreen }) => (
          <>
            <Routes>
              <Route
                path="workspace/:workspaceId/:level/:zone/:position/:tabKey"
                element={
                  <WorkspaceLayoutWrapper toggleFullscreen={toggleFullscreen} />
                }
              />
              <Route
                index
                element={
                  <WorkspaceHomePage
                    apps={[
                      "letsSecure",
                      "itsRIGHTtime",
                      "letsDiscuss",
                      "letsGrowTogether",
                      "CREATIVE",
                    ]}
                    toggleFullscreen={toggleFullscreen}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  <LoginPage handleToggleFullscreen={toggleFullscreen} />
                }
              />
              <Route
                path="*"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                element={
                  <ErrorPage
                    {...({ handleNavigate: () => navigate("/") } as any)}
                  />
                }
              />
            </Routes>
          </>
        )}
      </FullscreenWrapper>
    </CombinedProviders>
  );
};
