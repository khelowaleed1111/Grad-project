---
name: Aqar Heritage & Trust
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#41493e'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#717a6d'
  outline-variant: '#c0c9bb'
  surface-tint: '#2a6b2c'
  primary: '#00450d'
  on-primary: '#ffffff'
  primary-container: '#1b5e20'
  on-primary-container: '#90d689'
  inverse-primary: '#91d78a'
  secondary: '#835400'
  on-secondary: '#ffffff'
  secondary-container: '#fcab28'
  on-secondary-container: '#694300'
  tertiary: '#00450d'
  on-tertiary: '#ffffff'
  tertiary-container: '#055f18'
  on-tertiary-container: '#86d881'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf4a4'
  primary-fixed-dim: '#91d78a'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#0c5216'
  secondary-fixed: '#ffddb5'
  secondary-fixed-dim: '#ffb957'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#643f00'
  tertiary-fixed: '#a3f69c'
  tertiary-fixed-dim: '#88d982'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005312'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-h1:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  display-h2:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.3'
  ui-h3:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  ui-h4:
    fontFamily: DM Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-main:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  arabic-body:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.8'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 24px
---

## Brand & Style
This design system centers on the intersection of heritage and modern real estate reliability. The personality is authoritative yet welcoming, designed to evoke the stability of land ownership and the premium nature of high-value investments. 

The visual style is **Corporate Modern with Editorial nuances**. It leverages high-contrast serif typography for display elements to signal prestige, while maintaining a functional, utilitarian grid for property discovery. The emotional response is one of confidence and calm, achieved through a disciplined use of white space and a palette rooted in natural, "grounded" tones.

## Colors
The color strategy utilizes a deep "Forest Green" as the primary anchor to symbolize growth and stability. 

- **Primary Green (#1B5E20):** Reserved for brand moments, primary actions, and high-level navigation.
- **Primary Mid (#2E7D32):** Used for interactive states and iconography to maintain readability.
- **Primary Light (#E8F5E9):** Employed for large surface areas, section backgrounds, and success states to soften the UI.
- **Accent Gold (#F9A825):** Used sparingly for "Premium" or "Featured" tags and critical call-to-actions to draw the eye without overwhelming.
- **Accent Light Gold (#FFF8E1):** Specifically for highlighting high-value property details or background subtle tints.

## Typography
The system uses a tri-font strategy to balance editorial elegance with functional clarity.

1.  **Playfair Display:** Used for H1/H2 headlines and numerical price displays. It provides the "Premium" feel essential for real estate.
2.  **DM Sans:** The workhorse for the UI. It handles H3/H4 subheaders, body text, and button labels, ensuring high legibility on mobile devices.
3.  **Cairo:** Specifically integrated for Arabic localization, paired in weight to DM Sans to ensure visual parity between languages.

Always use higher line heights for Arabic (1.8) compared to English (1.6) to accommodate script descenders and ascenders.

## Layout & Spacing
The design system utilizes a **12-column fixed grid** for desktop (1140px max-width) and a **fluid 4-column grid** for mobile. 

The spacing rhythm follows a 4px baseline. Use `md` (16px) for standard internal padding within cards and `lg` (24px) for vertical stacking of sections. Large "Hero" areas should utilize `xl` (40px) padding to create an airy, upscale feel.

## Elevation & Depth
Depth is created using **Ambient Shadows** and tonal layering. Shadows should never be pure black; they are tinted with the primary green (#1B5E20) at very low opacities to maintain warmth.

- **Level 1 (Cards):** `0px 4px 20px rgba(27, 94, 32, 0.04)` — subtle lift for property listings.
- **Level 2 (Hover/Active):** `0px 8px 30px rgba(27, 94, 32, 0.08)` — used when a user interacts with a card.
- **Level 3 (Modals/Dropdowns):** `0px 12px 40px rgba(0, 0, 0, 0.12)` — clear separation from the background.

Use Primary Light (#E8F5E9) as a "Layer 0" background color to differentiate content sections without using borders.

## Shapes
The shape language is "Soft-Rounded." 

- **Property Cards:** Use a 16px radius to feel approachable and modern.
- **Interactive Elements:** Buttons and Input fields use a tighter 12px radius, providing a slightly more structured and "active" appearance compared to the softer cards.
- **Selection Chips:** Utilize a full pill-shape (100px) to distinguish them from actionable buttons.

## Components
- **Buttons:** Primary buttons use the Primary Green background with white text. High-emphasis "Contact" buttons may use the Accent Gold. All buttons feature a subtle 2px vertical lift on hover.
- **Inputs:** Utilize "Floating Labels" that transition from the placeholder position to the top border on focus. Border color changes to Primary Mid (#2E7D32) on focus.
- **Property Cards:** Images should feature a slight "Skeleton Shimmer" during load. Price tags are overlayed in the top-left using the Primary Green with high-contrast Playfair Display numerals.
- **Map Pins:** Custom pins using the brand’s Primary Green. On-click, pins should perform a "drop" animation with a slight bounce (cubic-bezier(0.175, 0.885, 0.32, 1.275)).
- **Chips:** Used for property features (e.g., "3 Bed", "Pool"). These should be ghost-style with a 1px Primary Light border.
- **Lists:** Real estate listings should use staggered entrance animations (20ms delay per item) to make the search results feel responsive and fluid.