import { Icons, type IconTypes } from "@/assets";
import { IconButton } from "@/atoms/";

export const TabIcon = ({
  icon,
  onClick,
  label,
  isActive = false,
}: {
  icon: IconTypes;
  onClick?: () => void;
  label?: string;
  isActive: boolean;
}) => {
  return (
    <div
      style={{
        borderBottom: isActive ? `2px solid var(--color-primary)` : "none",
      }}
    >
      <IconButton
        icon={Icons[icon]}
        size={1.3}
        onClick={onClick}
        label={label}
      />
    </div>
  );
};
