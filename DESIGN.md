---
name: Ironclad Intelligence
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#cac4d3'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#938e9d'
  outline-variant: '#484551'
  surface-tint: '#ccbdff'
  primary: '#ccbdff'
  on-primary: '#341c7b'
  primary-container: '#4f3a96'
  on-primary-container: '#c0afff'
  inverse-primary: '#634fac'
  secondary: '#ffa9fe'
  on-secondary: '#590062'
  secondary-container: '#76257d'
  on-secondary-container: '#f597f6'
  tertiary: '#faba73'
  on-tertiary: '#482900'
  tertiary-container: '#6c4000'
  on-tertiary-container: '#ecae67'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e7deff'
  primary-fixed-dim: '#ccbdff'
  on-primary-fixed: '#1f0060'
  on-primary-fixed-variant: '#4b3692'
  secondary-fixed: '#ffd6fa'
  secondary-fixed-dim: '#ffa9fe'
  on-secondary-fixed: '#36003c'
  on-secondary-fixed-variant: '#73227a'
  tertiary-fixed: '#ffddbb'
  tertiary-fixed-dim: '#faba73'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-page: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered for the "blue-collar smart" professional—individuals who value precision, durability, and immediate utility. It balances a rugged, industrial foundation with the sophisticated polish of high-end SaaS. The brand personality is authoritative yet practical, evokes trust through structural stability, and signals innovation through controlled digital "glows."

The visual style is a blend of **Industrial Minimalism** and **High-Contrast Modernity**. It utilizes heavy-duty layouts reminiscent of blueprints and technical manuals, layered with sophisticated interactive elements that signify the AI's power. The interface should feel like a high-tech dashboard found on a modern job site: robust, efficient, and built to last.

## Colors

The palette is anchored in a professional **dark mode** default to reduce eye strain and emphasize the industrial aesthetic. 

- **Primary & Secondary Purples:** Used for high-level branding, primary actions, and identifying AI-driven insights.
- **Accent Blue:** Reserved for tactical utility—notifications, status updates, and progress indicators.
- **Neutrals:** The background uses a tiered grey system. `#333333` serves as the standard workspace, while deeper shades provide structural depth and lighter shades define interactive surfaces.
- **Border Glows:** Interactive elements utilize subtle inner and outer glows in primary and accent colors to simulate high-tech instrumentation.

## Typography

This design system uses a triple-font strategy to balance industrial character with readability:
1. **Space Grotesk (Display):** Chosen for its technical, geometric nature that mimics the "Quantify" aesthetic while maintaining modern web standards. Use for all major headers.
2. **Hanken Grotesk (Body):** A clean, highly legible sans-serif that remains professional and sharp at all sizes.
3. **JetBrains Mono (Technical):** Used for data points, IDs, timestamps, and status labels to reinforce the "smart utility" feel.

Tighten letter spacing on large displays to create a dense, "locked-in" look. Increase line height for body text to ensure field workers can digest information quickly.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid Grid**. Content is housed in a 12-column system with generous 24px gutters to prevent visual clutter and maintain an industrial "heavy-duty" feel.

- **Desktop:** 12 columns, max-width 1440px.
- **Tablet:** 8 columns, fluid width with 32px side margins.
- **Mobile:** 4 columns, fluid width with 16px side margins.

Use a strict 8px baseline grid. Elements should feel "bolted" into place; avoid floating components. Use horizontal rules and vertical separators to define work zones clearly, mimicking the structured look of technical documentation.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Active Glows** rather than soft, natural shadows. 

- **Level 0 (Background):** Deepest grey (`#1A1A1A`), used for the main application shell.
- **Level 1 (Canvas):** Standard UI background (`#333333`). 
- **Level 2 (Cards):** Elevated containers (`#3D3D3D`) with a 1px `border_subtle`.
- **Level 3 (Interactive):** When hovered or active, cards gain a `primary_glow` or `accent_glow` border effect (1px solid with a 4px-8px soft outer spread).

This "inner-glow" approach makes elements look like they are backlit or powered by internal circuitry, reinforcing the AI-first identity.

## Shapes

The shape language is **Soft-Industrial**. We avoid fully sharp corners to maintain a premium SaaS feel, but keep radii small (4px - 12px) to preserve the no-nonsense, engineered look.

- **Standard Buttons/Inputs:** 4px radius (Soft).
- **Cards & Modules:** 8px radius (Large).
- **Status Chips:** 12px (Extra-large/Pill) to differentiate them from structural blocks.

## Components

### Buttons
Primary buttons use a solid `primary_color_hex` with white text. On hover, apply a `glow_primary` effect. Secondary buttons should be "Ghost" style—transparent backgrounds with a `border_subtle` and `accent_color` text.

### Cards
Cards are the primary container. They must have a subtle 1px border. For "High-ROI" insights or AI alerts, use a gradient top-border using the `primary` to `secondary` purple ramp.

### Input Fields
Inputs should feel "recessed." Use a slightly darker background than the surface they sit on, with a `JetBrains Mono` placeholder font to emphasize the technical nature of data entry.

### Chips & Tags
Use monospaced typography (`label-mono`) inside tags. Status-based chips (e.g., "In Progress") should use the Blue Accent color with 10% opacity background and 100% opacity text.

### Border Glows
Apply a 1px border with a CSS `box-shadow: 0 0 10px var(--glow_primary)` to highlight active AI tasks or high-priority data points.