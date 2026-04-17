import { TabText } from "@/layouts/workspace/bars/TabText";
import { TabIcon } from "@/layouts/workspace/bars/TabIcon";
import { TabDropdown } from "@/layouts/workspace/bars/TabDropdown";
import type { TabBarConfig } from "@/layouts/workspace/bars/TabBar.types";
import { TabBar } from "@/layouts/workspace/bars/TabBar";
import { IconButton, SearchBox } from "@/atoms";
import { Icons } from "@/assets";
import { TestDropdown } from "../atoms/TestDropdown";

const config: TabBarConfig = {
  orientation: "horizontal",

  start: [
    {
      id: "more2",
      type: "dropdown",
      trigger: { type: "icon", icon: "mediaIcon" },
      items: [
        { key: 1, value: "Edit" },
        { key: 2, value: "Delete" },
      ],
    },
    {
      id: "home",
      type: "text",
      text: "Home",
    },
    {
      id: "menu",
      type: "icon",
      icon: "meetingIcon",
    },
  ],

  center: [
    // {
    //   id: "search",
    //   type: "custom",
    //   render: () => (
    //     <SearchBox
    //       suggestions={[{ code: "a", name: "Option A" }]}
    //       setResult={() => {}}
    //     />
    //   ),
    // },
  ],

  end: [
    {
      id: "more1",
      type: "dropdown",
      trigger: { type: "icon", icon: "mediaIcon" },
      items: [
        { key: 1, value: "Edit" },
        { key: 2, value: "Delete" },
      ],
    },
    {
      id: "more2",
      type: "dropdown",
      trigger: { type: "icon", icon: "mediaIcon" },
      items: [
        { key: 1, value: "Edit" },
        { key: 2, value: "Delete" },
      ],
    },
    {
      id: "more3",
      type: "dropdown",
      trigger: { type: "icon", icon: "mediaIcon" },
      items: [
        { key: 1, value: "Edit" },
        { key: 2, value: "Delete" },
      ],
    },
    // {
    //   id: "search1",
    //   type: "custom",
    //   render: () => <TestDropdown />,
    // },
  ],
};

export const UseLayoutExample = () => {
  return (
    <div>
      <TabText text="Example Tab of this" />
      <TabIcon
        icon="AccessIcon"
        label="Access"
        onClick={() => {
          console.log("DDDD : Clikced ");
        }}
      />

      <div style={{ border: "1px solid black" }}>
        <IconButton icon={Icons.AccessIcon} size={2} />
      </div>

      <TabDropdown
        trigger={<TabText text="Options" />}
        items={[
          { key: 1, value: "Edit" },
          {
            key: 2,
            value: "Delete",
            description: "Remove permanently",
            box: ["Danger", "2"],
          },
        ]}
        onSelect={(key) => console.log(key)}
      />

      <TabBar config={config} />
      {/* <TabBar config={{ ...config, orientation: "vertical", center: [] }} /> */}
    </div>
  );
};
