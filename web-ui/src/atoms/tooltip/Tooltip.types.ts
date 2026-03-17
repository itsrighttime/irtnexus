import type { ReactNode } from "react";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode | string;
  color?: string;
  backgroundColor?: string;
  width?: string;
  delay?: number;
}
