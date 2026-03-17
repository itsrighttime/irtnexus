# `createAtom` – Developer Guide

`createAtom` is a **generic abstract factory** used to generate **pre-configured UI atoms** (like Button, TextInput, Badge) with **consistent design rules**.

It ensures:

- No design inconsistencies
- No repeated prop definitions
- Centralized control via config
- Scalable across all atoms

# Import

```ts id="imp1"
import { createAtom, ATOMS, PRESETS } from "@/your-design-system";
```

# Core Concept

Instead of doing this :

```tsx id="bad1"
<Button variant="primary" size="medium" radius="md" />
```

You do this :

```tsx id="good1"
const PrimaryButton = createAtom(ATOMS.BUTTON, PRESETS.BUTTON.A.PRIMARY);

<PrimaryButton>Click Me</PrimaryButton>;
```

> The factory automatically applies the correct design config.

# Function Signature

```ts id="sig1"
createAtom(atom, preset, subPreset?)
```

| Param       | Type               | Description                               |
| ----------- | ------------------ | ----------------------------------------- |
| `atom`      | `ATOMS`            | Which atom (Button, TextInput, etc.)      |
| `preset`    | `PRESETS.<ATOM>.A` | Main variant (e.g. primary, secondary)    |
| `subPreset` | `PRESETS.<ATOM>.B` | Optional variation (default, small, etc.) |

# Preset Structure

```ts id="preset-structure"
PRESETS.BUTTON = {
  A: { PRIMARY, SECONDARY }, // Main variants
  B: { DEFAULT, SMALL, ERROR, SUCCESS }, // Sub variants
};
```

# Default Behavior

If `subPreset` is **not provided**, the system automatically uses:

```ts id="default"
DEFAULT;
```

# Usage Examples

## 1. Default Primary Button

```tsx id="ex1"
const PrimaryButton = createAtom(ATOMS.BUTTON, PRESETS.BUTTON.A.PRIMARY);

<PrimaryButton>Primary</PrimaryButton>;
```

> Applies:

- `size: medium`
- `radius: md`
- `variant: primary`

## 2. Small Primary Button

```tsx id="ex2"
const SmallPrimaryButton = createAtom(
  ATOMS.BUTTON,
  PRESETS.BUTTON.A.PRIMARY,
  PRESETS.BUTTON.B.SMALL,
);

<SmallPrimaryButton>Small</SmallPrimaryButton>;
```

> Applies:

- `size: small`
- `radius: sm`

## 3. Secondary Button

```tsx id="ex3"
const SecondaryButton = createAtom(ATOMS.BUTTON, PRESETS.BUTTON.A.SECONDARY);

<SecondaryButton>Cancel</SecondaryButton>;
```

## 4. Button with Props

```tsx id="ex4"
<PrimaryButton onClick={() => alert("Clicked")} block />
```

> You can still pass:

- `onClick`
- `block`
- `iconLeft`
- `loading`
- etc.

## 5. Text Input

```tsx id="ex5"
const DefaultInput = createAtom(
  ATOMS.TEXT_INPUT,
  PRESETS.BUTTON.B.DEFAULT
);

const ErrorInput = createAtom(
  ATOMS.TEXT_INPUT,
  PRESETS.BUTTON.B.ERROR
);

<DefaultInput placeholder="Enter name" />
<ErrorInput placeholder="Invalid input" />
```

## 6. Badge

```tsx id="ex6"
const SuccessBadge = createAtom(ATOMS.BADGE, PRESETS.BUTTON.B.SUCCESS);

<SuccessBadge>Success</SuccessBadge>;
```

# Passing Additional Props

Factory **does not block props**, it only injects defaults:

```tsx id="props1"
<PrimaryButton iconLeft={<Icon />} loading color="#ff00ff">
  Save
</PrimaryButton>
```

# Rules to Follow

### DO

- Always use `createAtom` instead of raw atoms
- Use `ATOMS` and `PRESETS` constants
- Rely on `DEFAULT` unless variation is needed

### DON'T

```tsx id="bad2"
// ❌ Avoid this
<Button size="small" radius="lg" variant="primary" />
```

> Breaks design consistency

# Mental Model

Think of it like:

```
Atom (Button)
   ↓
Variant (Primary / Secondary)
   ↓
Sub Variant (Default / Small / Error)
   ↓
Final Config (size, radius, variant)
```

# How It Works Internally

```ts id="internal"
createAtom("Button", "primary", "small")
→ resolves to:
{ size: "small", radius: "sm", variant: "primary" }
```

# Quick Combination Table

| Atom      | Variant (A) | SubPreset (B) | Result                  |
| --------- | ----------- | ------------- | ----------------------- |
| Button    | PRIMARY     | DEFAULT       | Medium primary button   |
| Button    | PRIMARY     | SMALL         | Small primary button    |
| Button    | SECONDARY   | DEFAULT       | Medium secondary button |
| TextInput | —           | DEFAULT       | Normal input            |
| TextInput | —           | ERROR         | Error input             |
| Badge     | —           | DEFAULT       | Primary badge           |
| Badge     | —           | SUCCESS       | Success badge           |
| Badge     | —           | ERROR         | Error badge             |

# Key Benefits

### Design Consistency

Every button/input/badge looks the same across the app.

### Centralized Control

Change config once → updates everywhere.

### Developer Simplicity

No need to remember:

- size
- radius
- variant

### Scalability

Add new atoms or presets without breaking existing code.

# Final Summary

- `createAtom` = **factory for consistent UI**
- `ATOMS` = what component
- `PRESETS` = how it should look
- `DEFAULT` = fallback
