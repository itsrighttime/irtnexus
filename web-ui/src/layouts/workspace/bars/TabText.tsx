import { Button } from "@/atoms";

const TAB_LENGTH = 15;

export const TabText = ({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) => {
  const text_ =
    text.length > TAB_LENGTH ? text.slice(0, TAB_LENGTH) + "..." : text;
  return (
    <Button variant="tertiary" onClick={onClick}>
      {text_}
    </Button>
  );
};
