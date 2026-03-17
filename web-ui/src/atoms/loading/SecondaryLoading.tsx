"use client";

import React from "react";
import { CubesLoader } from "./LoadingStyle";

export const SecondaryLoading: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CubesLoader />
    </div>
  );
};
