// helper/formatSingleTab.ts
import { getIconByKey } from "./getIconByKey.js";
import type { TabItem, Section, ClickHandlerArgs, ClickHandlerReturn } from "./types.js";

export const formatSingleTab = (
  tab: TabItem,
  clickHandler: (args: ClickHandlerArgs) => ClickHandlerReturn,
  section: Section
): TabItem => ({
  ...tab,
  onClick: (clickedValue: string) =>
    clickHandler({
      tab: { key: clickedValue, ...section },
      value: tab.value,
    }).onClick(
      // TODO: handle title update for dropdowns
      clickedValue
    ),
  icon: tab.isIcon ? getIconByKey(tab.key) || null : null,
});
