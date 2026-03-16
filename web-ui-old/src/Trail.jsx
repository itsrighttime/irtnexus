import { FieldSection } from "#components";
import { MasonryColumns } from "#layouts";
import { profileHelpers } from "core-ui";

const { userProfileFields } = profileHelpers;

export function Trial() {
  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <MasonryColumns columns={4} align="center" columnWidth={650}>
        <FieldSection
          header={{ title: "Profile 1", buttons: ["public", "edit", "delete"] }}
          fields={[...userProfileFields, ...userProfileFields]}
        />
        <FieldSection
          header={{ title: "Identity 2", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
        <FieldSection
          header={{ title: "Security 3", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
        <FieldSection
          header={{ title: "Settings 4", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
        <FieldSection
          header={{ title: "Privacy 5", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
        <FieldSection
          header={{ title: "Profile 6", buttons: ["edit", "delete"] }}
          fields={[...userProfileFields, ...userProfileFields]}
        />
        <FieldSection
          header={{ title: "Identity 7", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
        <FieldSection
          header={{ title: "Security 8", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
        <FieldSection
          header={{ title: "Settings 9", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
        <FieldSection
          header={{ title: "Privacy 10", buttons: ["edit", "delete"] }}
          fields={userProfileFields}
        />
      </MasonryColumns>
    </div>
  );
}
