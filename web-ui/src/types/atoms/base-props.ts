export interface BaseProps {
  className?: string; // Custom CSS class override
  style?: React.CSSProperties; // Inline style override
  id?: string; // Unique ID
  theme?: "light" | "dark" | string; // Theme variant
  size?: "small" | "medium" | "large"; // Controls dimensions and typography
  radius?: "none" | "sm" | "md" | "lg" | string; // Border radius
  color?: string; // Primary color override
  disabled?: boolean; // Disabled state
  loading?: boolean; // Loading state
  onClick?: () => void; // Generic click handler
  onChange?: (value: any) => void; // Generic change handler
  responsive?: boolean; // Container-query based responsiveness
  tooltip?: string; // Optional tooltip text
  ariaLabel?: string; // Accessibility label
}
