# 🔹 Button Component – Developer Guide

The `Button` component is a **polymorphic, fully customizable React button** designed to support:

- Variants (primary, secondary, etc.)
- Sizes and border radii
- Loading and disabled states
- Icons (left, right, icon-only)
- Block/full-width layout
- Color overrides via CSS variables
- Accessibility via ARIA attributes
- Polymorphic usage with `as` prop

## 📦 Installation / Import

```tsx
import { Button } from "@/components/Button";
```

## ⚛️ Basic Usage

```tsx
<Button>Primary Button</Button>
```

- Default variant: `primary`
- Default size: `medium`
- Default radius: `md`

Renders a medium, rounded, primary button with white text.

## 🔹 Variants

The `variant` prop controls the button style.

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

- `primary`: Solid, main color
- `secondary`: Outline button
- `tertiary`: Text-only
- `ghost`: Transparent, neutral
- `destructive`: Red, for destructive actions

**CSS note:** The background uses `--button-color` for primary, allowing dynamic color override.

## 🔹 Sizes

The `size` prop changes padding and font-size.

```tsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

- `small`: 6px–10px padding, 14px font
- `medium`: 8px–14px padding, 16px font
- `large`: 12px–18px padding, 18px font

## 🔹 Border Radius

The `radius` prop adjusts the corner roundness.

```tsx
<Button radius="none">Sharp</Button>
<Button radius="sm">Small</Button>
<Button radius="md">Medium</Button>
<Button radius="lg">Large</Button>
```

- Maps to CSS tokens: `--radius-none`, `--radius-sm`, etc.

## 🔹 Icons

Supports icons on **left**, **right**, or **icon-only** buttons.

```tsx
<Button iconLeft={<ArrowLeftIcon />}>Back</Button>
<Button iconRight={<ArrowRightIcon />}>Next</Button>
<Button iconOnly={<SearchIcon />} ariaLabel="Search" />
```

- `iconLeft`: Renders icon before the label
- `iconRight`: Renders icon after the label
- `iconOnly`: Only renders icon (requires `ariaLabel` for accessibility)

> Accessibility: Icon-only buttons must provide `aria-label`.

## 🔹 Block / Full-width

Use `block` prop to make button stretch the full width of its container.

```tsx
<Button block>Full Width Button</Button>
```

- Renders a button with `width: 100%`

## 🔹 Loading State

```tsx
<Button loading>Loading...</Button>
```

- Shows spinner
- Disables button interaction
- Hides iconLeft, iconRight, and children while loading

## 🔹 Disabled State

```tsx
<Button disabled>Disabled Button</Button>
```

- Disables click
- Applies visual dimming (`opacity: 0.6`)
- Cursor: `not-allowed`

## 🔹 Color Override

```tsx
<Button color="#ff00ff">Custom Color</Button>
```

- Overrides `--button-color` for the primary background
- Useful for theming or contextual buttons

## 🔹 Polymorphic Usage (`as`)

The button supports polymorphic rendering with `as` prop.

```tsx
<Button as="a" href="/home">Link Button</Button>
<Button as="div" onClick={() => alert("Div clicked")}>Div Button</Button>
```

- Default is `<button>`
- Can render `<a>`, `<div>`, `<span>`, etc.
- `disabled` is ignored for non-button elements (use `aria-disabled` instead)

## 🔹 Responsive / Additional Props

- `responsive` (optional) sets `data-responsive` attribute for container queries or responsive hooks
- `tooltip` sets `title` attribute
- `id`, `style`, `className`, and other standard HTML props are fully supported

## 🔹 Accessibility

- `aria-disabled` and `aria-busy` are applied automatically
- `aria-label` must be provided for icon-only buttons
- `focus-visible` outline supported for keyboard navigation

## 🔹 Examples

```tsx
<Button variant="primary" size="large" radius="lg" iconLeft={<PlusIcon />}>
  Add Item
</Button>

<Button variant="destructive" size="medium" block loading>
  Deleting...
</Button>

<Button as="a" href="/profile" variant="secondary" iconRight={<ArrowRightIcon />} />
```

## 🔹 Permutations & Combinations Table

| Variant     | Size   | Radius | Icon Left | Icon Right | Icon Only | Block | Loading | Disabled |
| ----------- | ------ | ------ | --------- | ---------- | --------- | ----- | ------- | -------- |
| primary     | small  | none   | ✅        | ✅         | ✅        | ✅    | ✅      | ✅       |
| secondary   | medium | sm     | ✅        | ✅         | ✅        | ✅    | ✅      | ✅       |
| tertiary    | large  | md     | ✅        | ✅         | ✅        | ✅    | ✅      | ✅       |
| ghost       | small  | lg     | ✅        | ✅         | ✅        | ✅    | ✅      | ✅       |
| destructive | medium | md     | ✅        | ✅         | ✅        | ✅    | ✅      | ✅       |

> Notes:
>
> - Any combination of `variant`, `size`, `radius` is valid
> - Icon props can coexist or be exclusive (`iconOnly`)
> - `block`, `loading`, `disabled` can be combined independently
> - `color` can override the primary variant color in any combination

This guide covers **all major use cases** and should allow any developer to use the Button component confidently in a design system, with **full clarity** on the API and combinations.
