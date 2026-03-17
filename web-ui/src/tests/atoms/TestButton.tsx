// import { PlusIcon, SettingsIcon } from "../icons";

import { Button } from "@/atoms";

export const TestButton = () => {
  return (
    <div
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Variants */}
      <section>
        <h3>Variants</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3>Sizes</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      {/* States */}
      <section>
        <h3>States</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button radius="25px" color="red" loading>Loading...</Button>
        </div>
      </section>

      {/* Icons */}
      <section>
        <h3>Icons</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Replace with your icons */}
          <Button iconLeft={<span>➕</span>}>Add</Button>
          <Button iconRight={<span>⚙️</span>}>Settings</Button>
          <Button variant="secondary"  iconOnly iconLeft={<span>⭐</span>} />
        </div>
      </section>

      {/* Block */}
      <section>
        <h3>Block Button</h3>
        <div style={{ width: "300px" }}>
          <Button block>Full Width</Button>
        </div>
      </section>

      {/* Radius */}
      <section>
        <h3>Radius</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button radius="none">None</Button>
          <Button radius="sm">Small</Button>
          <Button radius="md">Medium</Button>
          <Button radius="lg">Large</Button>
        </div>
      </section>

      {/* Polymorphic */}
      <section>
        <h3>Polymorphic</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button as="a" href="https://example.com" target="_blank">
            Anchor Button
          </Button>
        </div>
      </section>

      {/* Interaction Test */}
      <section>
        <h3>Interaction</h3>
        <Button onClick={() => alert("Clicked!")}>Click Me</Button>
      </section>
    </div>
  );
};
