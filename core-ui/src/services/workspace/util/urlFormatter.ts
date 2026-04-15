import { toKebabCase } from "@/utils";

interface MakeUrlParams {
  level: string;
  zone: string;
  position: string;
  key: string;
  workspaceId: string;
}

export const makeUrl = (
  { level, zone, position, key, workspaceId }: MakeUrlParams,
  isWorkspace: boolean,
): string => {
  const workspace = isWorkspace ? key : workspaceId;
  const usedKey = isWorkspace ? "home" : key;
  const parts = [workspace, level, zone, position, usedKey].map(toKebabCase);
  return `/workspace/${parts.join("/")}`;
};
