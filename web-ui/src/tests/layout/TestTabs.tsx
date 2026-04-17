import { TabText } from "@/layouts/workspace/bars/TabText";
import { TabIcon } from "@/layouts/workspace/bars/TabIcon";
import { TabDropdown } from "@/layouts/workspace/bars/TabDropdown";
import type { TabBarConfig } from "@/layouts/workspace/bars/TabBar.types";
import { TabBar } from "@/layouts/workspace/bars/TabBar";
import { IconButton, SearchBox } from "@/atoms";
import { Icons } from "@/assets";
import { TestDropdown } from "../atoms/TestDropdown";
import { TabLabel } from "@/layouts/workspace/bars/TabLabel";

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
      type: "label",
      text: "More Options",
      leftIcons: [],
      rightIcons: [
        {
          icon: "AccessIcon",
          onClick: () => console.log("Icon clicked"),
          color: "var(--color-text-light)",
          
        },
      ],
      tokens: [{ text: "PRO", color: "var(--color-primary)" }],
      onClick: () => console.log("Label tab clicked"),
      border: "1px solid var(--color-gray3)",
      background: "var(--color-gray1)",
    },
    {
      id: "more4",
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

export const TestTabs = () => {
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

      <TabLabel
        leftIcons={[
          {
            icon: "AccessIcon",
            onClick: () => console.log("Left icon clicked"),
          },
        ]}
        tokens={[{ text: "PRO", color: "var(--color-primary)" }]}
        text="Project Alpha"
        rightIcons={[
          {
            icon: "ActivityIcon",
            onClick: () => console.log("Right icon clicked"),
          },
        ]}
        onClick={() => console.log("Tab clicked")}
      />

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
