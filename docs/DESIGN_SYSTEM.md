# Dental Clinic Design System

The existing Reception visual identity is the system baseline.

## Design Principles

1. Dense professional clinical interface.
2. RTL first.
3. Desktop-first reception workflow with responsive fallback.
4. Sky/blue family is the primary identity.
5. Cards are subtle, not decorative.
6. Operational status must be recognizable quickly.
7. Every repeated visual element must come from a shared component.

## Tokens

All visual values must be CSS variables.

Required token groups:

- Brand colors
- Semantic colors: success, warning, danger, info
- Surface/background colors
- Text colors
- Border colors
- Radius
- Shadow
- Spacing
- Font scale
- Density

Do not hardcode brand colors inside feature components.

## Shared UI Components

All reusable primitives live under:

`apps/web/components/ui/`

Required primitives:

- Button
- Input
- Select
- Checkbox
- RadioGroup
- SearchInput
- Card
- Modal
- ConfirmDialog
- Badge
- DataTable
- FormField
- EmptyState
- LoadingState
- Toast

Reception components may compose these primitives but must not restyle them independently without a documented variant.

## Variants

Buttons:
- primary
- secondary
- danger
- ghost

Badges:
- neutral
- info
- success
- warning
- danger

Density:
- compact
- comfortable

## Accessibility

- Every icon-only action needs an accessible label.
- Focus states must remain visible.
- Color must not be the only status indicator.
- Tables need readable headers.
- Modal focus and close behavior must be predictable.

## Visual Settings

User-adjustable visual settings may modify tokens only.
They must not directly alter feature component markup.

Current configurable settings:
- primary color
- dark brand color
- surface color
- page background
- radius
- font scale
- density
