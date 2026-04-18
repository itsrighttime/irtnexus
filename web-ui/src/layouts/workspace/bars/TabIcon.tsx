import { Icons, type IconTypes } from "@/assets";
import { IconButton } from "@/atoms/";

export const TabIcon = ({
  icon,
  onClick,
  label,
}: {
  icon: IconTypes;
  onClick?: () => void;
  label?: string;
}) => {
  return (
    <IconButton icon={Icons[icon]} size={1.3} onClick={onClick} label={label} />
  );
};
