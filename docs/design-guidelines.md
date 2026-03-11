# Design Guidelines - IUH Graduation Form System

## Brand Identity
- **University:** Truong Dai hoc Cong nghiep TP.HCM (IUH)
- **Faculty:** Khoa Thuong Mai - Du Lich
- **Values:** Innovation - Unity - Humanity
- **Tone:** Modern, institutional, trustworthy, welcoming

## Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--primary-900` | `#002266` | Headings, dark accents |
| `--primary-700` | `#003399` | Primary brand, buttons, links |
| `--primary-500` | `#0066CC` | Interactive elements, hover states |
| `--primary-100` | `#E6F0FF` | Light backgrounds, badges |
| `--accent-500` | `#FFB81C` | CTA highlights, success indicators |
| `--accent-100` | `#FFF5E0` | Accent backgrounds |
| `--neutral-900` | `#1A1A2E` | Body text |
| `--neutral-700` | `#333333` | Secondary text |
| `--neutral-400` | `#9CA3AF` | Placeholder, disabled text |
| `--neutral-200` | `#E5E7EB` | Borders, dividers |
| `--neutral-100` | `#F5F5F5` | Page background |
| `--neutral-0` | `#FFFFFF` | Card backgrounds |
| `--success` | `#16A34A` | Approved status |
| `--error` | `#DC2626` | Rejected status, validation errors |
| `--warning` | `#F59E0B` | Pending status |

## Typography
- **Font:** Be Vietnam Pro (Google Fonts, Vietnamese-optimized)
- **Weights:** 400 (body), 500 (medium), 600 (semibold), 700 (bold)
- **Import:** `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap`

| Element | Size | Weight | Line Height |
|---|---|---|---|
| Page title | 24px / 1.5rem | 700 | 1.3 |
| Section heading | 20px / 1.25rem | 600 | 1.4 |
| Card title | 18px / 1.125rem | 600 | 1.4 |
| Body | 16px / 1rem | 400 | 1.6 |
| Label | 14px / 0.875rem | 500 | 1.5 |
| Caption | 12px / 0.75rem | 400 | 1.5 |

## Spacing Scale
Based on 4px grid: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 4px | Inline gaps |
| `--space-sm` | 8px | Tight spacing |
| `--space-md` | 16px | Default gap |
| `--space-lg` | 24px | Section padding |
| `--space-xl` | 32px | Card padding |
| `--space-2xl` | 48px | Section gaps |
| `--space-3xl` | 64px | Page sections |

## Border Radius
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Inputs, small buttons |
| `--radius-md` | 8px | Buttons, badges |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Large cards, modals |

## Shadows
| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` |
| `--shadow-card` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` |
| `--shadow-card-hover` | `0 10px 25px rgba(0,51,153,0.12)` |

## Component Patterns

### Header
- Blue gradient: `linear-gradient(135deg, #003399, #0066CC)`
- White text, centered university name + faculty
- IUH logo top-center
- Height: 160px mobile, 200px desktop

### Cards
- White bg, `--radius-lg`, `--shadow-card`
- Hover: `--shadow-card-hover` + translateY(-2px), 200ms ease
- Padding: 24px mobile, 32px desktop
- Max width: 480px (form cards), 960px (dashboard)

### Form Inputs
- Height: 44px (touch-friendly)
- Border: 1px solid `--neutral-200`
- Focus: 2px ring `--primary-500` with 2px offset
- Radius: `--radius-sm`
- Font size: 16px (prevents iOS zoom)
- Error state: red border + error text below

### Buttons
- Primary: bg `--primary-700`, white text, `--radius-md`
- Height: 44px, padding: 0 24px
- Hover: bg `--primary-500`
- Disabled: opacity 0.5, cursor not-allowed
- Full-width on mobile

### Status Badges
- Pending: bg `--accent-100`, text `#92400E`, border `--warning`
- Approved: bg `#DCFCE7`, text `#166534`, border `--success`
- Rejected: bg `#FEE2E2`, text `#991B1B`, border `--error`
- Padding: 4px 12px, radius: 9999px, font-size: 12px, weight: 500

### File Upload
- Dashed border area, 2px dashed `--neutral-200`
- Icon + text centered
- Drag-hover: border `--primary-500`, bg `--primary-100`
- Show file name + size after selection

## Layout
- Max content width: 1200px, centered
- Page padding: 16px mobile, 24px tablet, 32px desktop
- Form max-width: 640px, centered
- Grid: CSS Grid / Flexbox, 2-col on desktop for admin

## Breakpoints
| Name | Width |
|---|---|
| Mobile | 0-767px |
| Tablet | 768-1023px |
| Desktop | 1024px+ |

## Accessibility
- Min contrast: 4.5:1 normal text, 3:1 large text (WCAG AA)
- Focus visible on all interactive elements
- `aria-label` on icon-only buttons
- Form fields linked with `<label for="">`
- Error messages linked with `aria-describedby`
- `prefers-reduced-motion`: disable transitions

## Animation
- Default transition: 200ms ease
- Card hover: translateY(-2px) + shadow
- Button hover: background color shift
- Form feedback: fade-in 300ms
- Respect `prefers-reduced-motion: reduce`
