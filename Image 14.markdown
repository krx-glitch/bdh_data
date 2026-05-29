---
name: Kinetic Pulse
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e5bcc4'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ac878f'
  outline-variant: '#5c3f45'
  surface-tint: '#ffb1c3'
  primary: '#ffb1c3'
  on-primary: '#66002c'
  primary-container: '#ff4b89'
  on-primary-container: '#590026'
  inverse-primary: '#bb0058'
  secondary: '#e6feff'
  on-secondary: '#003739'
  secondary-container: '#00f4fe'
  on-secondary-container: '#006c71'
  tertiary: '#ffb59a'
  on-tertiary: '#5a1b00'
  tertiary-container: '#fc5b00'
  on-tertiary-container: '#4f1700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#ffb1c3'
  on-primary-fixed: '#3f0019'
  on-primary-fixed-variant: '#8f0041'
  secondary-fixed: '#63f7ff'
  secondary-fixed-dim: '#00dce5'
  on-secondary-fixed: '#002021'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: Syne
    fontSize: 80px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  h2:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h3:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-edge: 32px
  section-gap: 120px
---

## Brand & Style

The design system is built to capture the raw energy and rhythmic precision of professional dance. It targets an audience that values movement, self-expression, and high-performance artistry. The visual language is defined by **High-Contrast Boldness** mixed with **Glassmorphism**, creating a digital environment that feels as immersive as a dark dance floor illuminated by stage lights.

The aesthetic avoids static layouts in favor of "fluid energy"—using asymmetrical compositions and overlapping elements to suggest motion even in a still state. Every interaction should feel like a beat, with snappy transitions and vibrant visual feedback that mirrors the adrenaline of a live performance.

## Colors

The palette is anchored in a deep, nocturnal charcoal to provide maximum contrast for the high-octane accents. 

- **Primary (Electric Pink):** Used for primary actions, critical highlights, and indicating "active" states.
- **Secondary (Neon Teal):** Used for secondary UI elements, success states, and rhythmic accents in gradients.
- **Tertiary (Sunset Orange):** Reserved for energetic call-outs, warnings, or seasonal class highlights.
- **Neutrals:** The background layers utilize varying depths of charcoal and navy-tinted blacks to create a sense of infinite space.

Avoid using solid white for large text blocks; instead, use high-clarity off-whites to prevent visual fatigue against the dark background.

## Typography

This design system employs a typographic hierarchy that prioritizes rhythm. **Syne** is the voice of the brand, chosen for its ultra-bold weights and unconventional character widths that mimic the varied pace of dance. 

- **Display Headings:** Use H1 and H2 in Syne for impact. Kerning should be tight to create a "blocky," powerful visual.
- **Sub-headers:** Montserrat provides a geometric, urban balance to the more expressive Syne.
- **Body Text:** Inter ensures that class schedules, instructor bios, and descriptions remain perfectly legible even on smaller mobile screens.

Use all-caps for labels and navigation items to maintain the high-energy, athletic tone.

## Layout & Spacing

The layout philosophy is based on a **Fluid Grid** with intentional "breathing room." In a high-energy system, whitespace is not empty—it is the stage. 

- **Generous Gaps:** Section vertical spacing is intentionally large (120px+) to allow the eye to rest between intense visual sections.
- **Asymmetric Balance:** Elements should often be offset from the standard grid lines to create a sense of "syncopation" or off-beat rhythm.
- **Safe Zones:** High-motion photography requires wide margins to ensure text doesn't clash with the dynamic lines of the dancers' bodies.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** and **Glows** rather than traditional drop shadows.

- **Atmospheric Depth:** Layers use semi-transparent background blurs (backdrop-filter: blur(20px)) to maintain a connection to the vibrant backgrounds.
- **Luminescent Borders:** Instead of shadows, use subtle 1px inner strokes in primary or secondary colors with a low opacity (10-20%) to give cards a "backlit" effect.
- **Motion Blur Overlays:** Dynamic photography should occasionally "break" out of its container, using motion-blur transitions to bridge the gap between foreground UI and background imagery.

## Shapes

The shape language is "Hyper-Rounded," reflecting the fluidity and grace of human movement.

- **Large Radii:** Standard components use 0.5rem (8px), but primary cards and containers utilize the `rounded-xl` (1.5rem / 24px) setting to soften the industrial feel of the dark theme.
- **Pill-shaped Accents:** Interactive elements like buttons and chips should always be fully rounded (pill-shaped) to represent the continuous nature of a dance routine.
- **Organic Masks:** Use fluid, non-geometric masks for image containers to prevent the design from feeling too rigid or "boxed in."

## Components

### Buttons
Primary buttons are pill-shaped with a vibrant gradient (Electric Pink to Sunset Orange). On hover, they should emit a subtle outer glow of the primary color. Secondary buttons use a "Ghost" style with a Neon Teal border.

### Cards
Cards are the primary content vehicle. They feature a `surface-container` background with a subtle linear gradient (Top-Left to Bottom-Right) and a large corner radius. Typography inside cards should be high-contrast for readability.

### Chips & Tags
Use for "Level" (Beginner, Pro) or "Style" (Hip-Hop, Contemporary). These should be small, all-caps labels with a subtle background tint of the accent colors.

### Input Fields
Inputs are dark-themed with a bottom-border only, turning Neon Teal on focus. This creates a "stage line" feel that is minimal and unobtrusive.

### Rhythmic Transitions
Include components for "Class Cards" that expand on click with a spring-physics animation, ensuring the transition feels as fluid as the movement taught in the studio.

### Visual Accents
Utilize "Floating Elements"—small geometric shapes or blurred orbs of color—that move slightly on scroll to reinforce the high-energy, rhythmic nature of the design system.