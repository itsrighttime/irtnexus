"use client";

import React from "react";
import { Button, Tooltip } from "@/atoms";

export const TestTooltip: React.FC = () => {
  return (
    <div
      style={{ padding: 80, display: "flex", gap: "40px", flexWrap: "wrap" }}
    >
      {/* Default tooltip */}
      <Tooltip content="This is a default tooltip">
        <Button>Hover me (default)</Button>
      </Tooltip>

      {/* Custom colors */}
      <Tooltip
        content="Custom colors tooltip"
        color="#fff"
        backgroundColor="#1e90ff"
      >
        <Button>Hover me (custom colors)</Button>
      </Tooltip>

      {/* Custom width */}
      <Tooltip
        content="A very wide tooltip to test width property"
        width="400px"
      >
        <Button>Hover me (wide tooltip)</Button>
      </Tooltip>

      {/* Short delay */}
      <Tooltip content="Tooltip with short delay" delay={500}>
        <Button>Hover me (short delay)</Button>
      </Tooltip>

      {/* Long delay */}
      <Tooltip content="Tooltip with long delay" delay={3000}>
        <Button>Hover me (long delay)</Button>
      </Tooltip>

      {/* Tooltip with JSX content */}
      <Tooltip
        content={
          <div style={{border: "1px solid red"}}>
            <strong>JSX Content</strong>
            <p>This tooltip contains HTML elements.</p>
          </div>
        }
      >
        <Button>Hover me (JSX content)</Button>
      </Tooltip>
    </div>
  );
};
