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
    <IconButton icon={Icons[icon]} size={1.6} onClick={onClick} label={label} />
  );
};
