import { WORKSPACE_SLOTS as WS, type WorkspaceSlot } from "../const/layout";
import { TAB_TYPE } from "../const";
import type { WorkspaceConfig } from "./layout.types";

type ValidationError = {
  slot: string;
  tabId: string;
  message: string;
};

const VERTICAL_SLOTS = new Set([
  WS.LEFT_PRIMARY,
  WS.LEFT_SECONDARY,
  WS.RIGHT_PRIMARY,
  WS.RIGHT_SECONDARY,
]);

const isVerticalSlot = (slot: WorkspaceSlot) => VERTICAL_SLOTS.has(slot as any);

/**
 * Validate workspace config rules
 */
export const validateWorkspaceConfig = (
  config: WorkspaceConfig,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  Object.entries(config).forEach(([slot, tabs_]) => {
    const tabs = Array.isArray(tabs_)
      ? tabs_
      : [...(tabs_.start ?? []), ...(tabs_.center ?? []), ...(tabs_.end ?? [])];

    if (!tabs?.length) return;

    const vertical = isVerticalSlot(slot as WorkspaceSlot);

    tabs.forEach((tab: any) => {
      if (!vertical) return;

      // RULE 1: TEXT tabs not allowed in vertical slots
      if (tab.type === TAB_TYPE.TEXT) {
        errors.push({
          slot,
          tabId: tab.id,
          message: "TEXT tabs are not allowed in vertical slots",
        });
      }

      // RULE 2: LABEL tabs not allowed in vertical slots
      if (tab.type === TAB_TYPE.LABEL) {
        errors.push({
          slot,
          tabId: tab.id,
          message: "LABEL tabs are not allowed in vertical slots",
        });
      }

      // RULE 3: Dropdown must be icon-based only
      if (tab.type === TAB_TYPE.DROPDOWN) {
        if (tab.trigger?.type !== TAB_TYPE.ICON) {
          errors.push({
            slot,
            tabId: tab.id,
            message: "Dropdown in vertical slots must use ICON trigger only",
          });
        }
      }

      // RULE 4: ICON tabs are allowed (no restriction)
      if (tab.type === TAB_TYPE.ICON) {
        // OK
      }
    });
  });

  return errors;
};
