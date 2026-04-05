# FinValora Design System
**Version 1.0 — For Vibe Coding**

A refined financial wellness design language built on trust, clarity, and quiet confidence. The aesthetic is *editorial finance* — where the precision of data meets the warmth of personal guidance.

---

## 1. Brand Essence

| Attribute | Expression |
|-----------|-----------|
| Personality | Trustworthy, calm, empowering |
| Tone | Confident but approachable |
| Feel | Premium fintech, not cold banking |
| Key Metaphor | A wise advisor in a sun-lit room |

---

## 2. Color System

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-white` | `#FFFFFF` | Surfaces, cards, light backgrounds |
| `--color-lavender` | `#C4C4DB` | Borders, disabled states, subtle dividers |
| `--color-teal` | `#8ABFB2` | Accent, highlights, interactive elements |
| `--color-forest` | `#01332B` | Primary CTA, headings, dark surfaces |
| `--color-void` | `#251B28` | Deep backgrounds, footer, code blocks |

### Semantic Tokens

```css
/* Backgrounds */
--bg-primary:       #FFFFFF;
--bg-secondary:     #F4F4F8;   /* White tinted with lavender — NOT in raw palette */
--bg-dark:          #01332B;
--bg-deep:          #251B28;
--bg-teal-soft:     #EAF4F2;   /* Teal at 12% opacity on white */

/* Text */
--text-primary:     #251B28;
--text-secondary:   #5A5468;   /* Void at 55% */
--text-muted:       #9B96A8;   /* Void at 35% */
--text-inverse:     #FFFFFF;
--text-accent:      #01332B;

/* Borders */
--border-default:   #C4C4DB;
--border-subtle:    #E5E5EF;
--border-strong:    #8ABFB2;

/* Interactive */
--interactive-primary:  #01332B;
--interactive-hover:    #024A3E;
--interactive-active:   #012820;
--interactive-accent:   #8ABFB2;
--interactive-focus:    rgba(138, 191, 178, 0.35);

/* Status */
--status-success:   #2D9E6B;
--status-warning:   #D97706;
--status-error:     #DC2626;
--status-info:      #8ABFB2;
```

### Color Usage Rules
- **Never** use `#C4C4DB` (lavender) as text — too low contrast
- **Always** pair `#01332B` backgrounds with `#FFFFFF` or `#8ABFB2` text
- The teal `#8ABFB2` works as accent on both light and dark backgrounds
- Use `#251B28` (void) only for maximum contrast moments: footers, modals, code

---

## 3. Typography

### Typeface Stack

```css
/* Display — Cormorant Garamond: editorial gravitas, financial authority */
--font-display: 'Cormorant Garamond', 'Georgia', serif;

/* Body — Plus Jakarta Sans: modern clarity, not overused */
--font-body: 'Plus Jakarta Sans', 'Helvetica Neue', sans-serif;

/* Mono — JetBrains Mono: numbers, code, data values */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

> **Import:** `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`

### Type Scale

| Token | Size | Line Height | Weight | Font | Usage |
|-------|------|-------------|--------|------|-------|
| `--text-display-2xl` | `72px` | `1.05` | `700` | Display | Hero headlines |
| `--text-display-xl` | `56px` | `1.1` | `600` | Display | Section heroes |
| `--text-display-lg` | `44px` | `1.15` | `600` | Display | Page titles |
| `--text-display-md` | `36px` | `1.2` | `600` | Display | Card headlines |
| `--text-heading-xl` | `28px` | `1.3` | `600` | Body | Section headings |
| `--text-heading-lg` | `22px` | `1.35` | `600` | Body | Sub-headings |
| `--text-heading-md` | `18px` | `1.4` | `600` | Body | Card titles |
| `--text-body-lg` | `18px` | `1.65` | `400` | Body | Lead paragraphs |
| `--text-body-md` | `16px` | `1.65` | `400` | Body | Default body |
| `--text-body-sm` | `14px` | `1.6` | `400` | Body | Secondary text |
| `--text-caption` | `12px` | `1.5` | `500` | Body | Labels, captions |
| `--text-overline` | `11px` | `1.4` | `600` | Body | Overlines (uppercase) |
| `--text-mono-lg` | `20px` | `1.4` | `500` | Mono | Financial figures |
| `--text-mono-md` | `16px` | `1.4` | `400` | Mono | Data values |

### Typography Rules
- Display font headlines should mix weight and italics for drama: e.g., `"Master Your *Money,*"` with the last word in italic
- Overlines are always `letter-spacing: 0.12em; text-transform: uppercase`
- Financial numbers always use `--font-mono` with `font-variant-numeric: tabular-nums`
- Max line length for body text: **68 characters (ch)**

---

## 4. Spacing System

Based on a `4px` base unit.

```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
--space-32:  128px;
```

### Section Padding
- Mobile: `--space-12` (48px) vertical
- Tablet: `--space-20` (80px) vertical
- Desktop: `--space-24` (96px) vertical

---

## 5. Layout & Grid

```css
/* Container */
--container-max:    1200px;
--container-narrow: 760px;    /* For centered content */
--container-wide:   1440px;   /* Full-bleed sections */

/* Grid */
--grid-columns:     12;
--grid-gap:         24px;     /* Desktop */
--grid-gap-mobile:  16px;     /* Mobile */
```

### Breakpoints
```css
--bp-sm:   480px;
--bp-md:   768px;
--bp-lg:   1024px;
--bp-xl:   1280px;
--bp-2xl:  1536px;
```

---

## 6. Border Radius

```css
--radius-sm:    4px;   /* Small badges, tags */
--radius-md:    8px;   /* Inputs, small cards */
--radius-lg:    12px;  /* Cards */
--radius-xl:    16px;  /* Large cards, modals */
--radius-2xl:   24px;  /* Feature cards */
--radius-pill:  9999px; /* Buttons, chips */
--radius-circle: 50%;  /* Avatars, icons */
```

---

## 7. Shadows & Elevation

```css
/* Layered teal-tinted shadows for warmth */
--shadow-xs:  0 1px 3px rgba(1, 51, 43, 0.06);
--shadow-sm:  0 2px 8px rgba(1, 51, 43, 0.08), 0 1px 3px rgba(1, 51, 43, 0.04);
--shadow-md:  0 4px 16px rgba(1, 51, 43, 0.10), 0 2px 6px rgba(1, 51, 43, 0.06);
--shadow-lg:  0 8px 32px rgba(1, 51, 43, 0.12), 0 4px 12px rgba(1, 51, 43, 0.07);
--shadow-xl:  0 16px 48px rgba(1, 51, 43, 0.14), 0 8px 20px rgba(1, 51, 43, 0.08);

/* Glow — for CTAs and interactive states */
--glow-teal:  0 0 0 4px rgba(138, 191, 178, 0.35);
--glow-forest: 0 0 24px rgba(1, 51, 43, 0.20);
```

---

## 8. Component Tokens

### Buttons

```css
/* Primary */
--btn-primary-bg:           #01332B;
--btn-primary-text:         #FFFFFF;
--btn-primary-hover-bg:     #024A3E;
--btn-primary-border:       transparent;

/* Secondary */
--btn-secondary-bg:         transparent;
--btn-secondary-text:       #01332B;
--btn-secondary-border:     #01332B;
--btn-secondary-hover-bg:   rgba(1, 51, 43, 0.06);

/* Accent (Teal) */
--btn-accent-bg:            #8ABFB2;
--btn-accent-text:          #01332B;
--btn-accent-hover-bg:      #75B0A3;

/* Ghost */
--btn-ghost-bg:             transparent;
--btn-ghost-text:           #251B28;
--btn-ghost-hover-bg:       rgba(37, 27, 40, 0.05);

/* Sizing */
--btn-height-sm:  36px;  padding: 0 16px;
--btn-height-md:  44px;  padding: 0 24px;
--btn-height-lg:  52px;  padding: 0 32px;
--btn-radius:     --radius-pill;
--btn-font-weight: 600;
--btn-font-size:  14px;
--btn-letter-spacing: 0.01em;
```

### Inputs / Form Fields

```css
--input-height:         48px;
--input-padding:        0 16px;
--input-bg:             #FFFFFF;
--input-border:         #C4C4DB;
--input-border-focus:   #8ABFB2;
--input-border-error:   #DC2626;
--input-text:           #251B28;
--input-placeholder:    #9B96A8;
--input-radius:         --radius-md;
--input-shadow-focus:   0 0 0 3px rgba(138, 191, 178, 0.30);
```

### Cards

```css
--card-bg:          #FFFFFF;
--card-border:      #E5E5EF;
--card-radius:      --radius-xl;
--card-shadow:      --shadow-md;
--card-shadow-hover: --shadow-lg;
--card-padding:     32px;
--card-gap:         24px;
```

### Navigation

```css
--nav-bg:               rgba(255, 255, 255, 0.92);
--nav-blur:             backdrop-filter: blur(16px);
--nav-border:           rgba(196, 196, 219, 0.4);
--nav-height:           64px;
--nav-link-color:       #251B28;
--nav-link-hover:       #01332B;
--nav-link-active:      #01332B;
```

---

## 9. Iconography

- **Style:** Outline icons, 1.5px stroke, rounded caps and joins
- **Recommended library:** Lucide Icons
- **Sizes:** 16px (inline), 20px (default), 24px (feature), 32px (hero icon)
- **Colors:** Inherit `currentColor` — never hardcode icon colors
- **Icon containers:** Circular or rounded-square backgrounds using `--bg-teal-soft` or `rgba(1,51,43,0.06)`

---

## 10. Motion & Animation

```css
/* Duration */
--duration-instant:   80ms;
--duration-fast:     150ms;
--duration-normal:   250ms;
--duration-slow:     400ms;
--duration-slower:   600ms;
--duration-page:     800ms;

/* Easing */
--ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);  /* Material standard */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1);    /* Elements entering */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1);    /* Elements leaving */
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful spring */
--ease-smooth:     cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Animation Rules
- **Page load:** Staggered fade-up reveals, `40px` Y offset, `--ease-decelerate`
- **Hover states:** Scale `1.02` on cards, transition `--duration-normal`
- **CTA buttons:** Subtle `translateY(-1px)` + shadow increase on hover
- **Number counters:** Animate financial figures counting up on viewport entry
- **No reduced motion:** Always wrap animations in `@media (prefers-reduced-motion: no-preference)`

---

## 11. Section Patterns

### Hero
- Background: `#FFFFFF` with subtle teal mesh gradient
- Headline: Display font, 56–72px, dark forest or void
- Subheadline: Body font, 18px, secondary text
- CTA: Primary + Ghost button pair, 52px height
- Visual: Right-floated dashboard mockup with shadow-xl

### Feature Cards
- Layout: 4-column grid, equal height
- Icon container: `48px` circle, `--bg-teal-soft`
- Title: `--text-heading-md`, forest color
- Body: `--text-body-sm`, secondary text

### Process Steps / Roadmap
- Background: `#F4F4F8` (light lavender-tinted)
- Connector: Dashed `2px` line in `--color-lavender`
- Step circle: `56px`, border `2px solid --color-teal`
- Active step: Filled forest background, white icon

### FAQ Accordion
- Background: Alternating white and `#F4F4F8`
- Border: Left `3px solid --color-teal` on open item
- Chevron: Rotates `180deg` on open, `--ease-spring`

### Feedback Form
- Card: White, `--shadow-lg`, centered, max-width `560px`
- Star rating: Teal fill on selection, `--ease-spring` scale animation

---

## 12. Do's and Don'ts

### ✅ Do
- Use Cormorant Garamond with italic for emotional moments
- Let the forest green `#01332B` be the dominant strong color
- Use teal `#8ABFB2` sparingly — it's the sparkle, not the base
- Keep cards clean with generous white space
- Apply shadows with forest-green tint, not generic black

### ❌ Don't
- Don't use gradients between teal and lavender — too pastel
- Don't place light lavender `#C4C4DB` text on white backgrounds
- Don't mix more than 3 font weights in a single component
- Don't round CTA buttons less than `--radius-pill` — they should be pill-shaped
- Don't use plain `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` — use the tinted shadow tokens

---

## 13. Accessibility

| Pairing | Contrast | Use |
|---------|----------|-----|
| `#251B28` on `#FFFFFF` | 16.8:1 ✅ AA/AAA | Body text |
| `#01332B` on `#FFFFFF` | 13.4:1 ✅ AA/AAA | Headings, links |
| `#FFFFFF` on `#01332B` | 13.4:1 ✅ AA/AAA | Button text |
| `#01332B` on `#8ABFB2` | 5.6:1 ✅ AA | Accent text |
| `#FFFFFF` on `#251B28` | 16.8:1 ✅ AA/AAA | Footer |
| `#9B96A8` on `#FFFFFF` | 3.2:1 ⚠️ Large text only | Muted text |

- Minimum touch target: `44×44px`
- Focus ring: `--glow-teal` on all interactive elements
- All icons must have `aria-label` or accompany visible text

---

## 14. File Naming Convention

```
/tokens/
  colors.css
  typography.css
  spacing.css
  motion.css
/components/
  button.css
  card.css
  input.css
  nav.css
/pages/
  home.css
```

---

*FinValora Design System — Built for clarity, trust, and financial confidence.*
