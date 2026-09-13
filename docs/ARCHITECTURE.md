# Gripwell — Engineering Architecture & Implementation Guidelines

> **Application Name:** Gripwell (Modern Billing App)  
> **Source Platform:** Google Stitch Project `4970474604554189402`  
> **Design Specification:** [docs/DESIGN.md](file:///c:/my-app/docs/DESIGN.md)  
> **Target Framework:** React Native 0.86+ / Expo SDK 57 / Expo Router v4 / TypeScript / React Native Web / NativeWind v4  
> **Supported Runtime Platforms:** Android, iOS, Web (Single Unified Codebase)  
> **Document Version:** 1.0.0 — Engineering Standard

---

## 1. Project Objective

The objective of this project is to implement **Gripwell** as an enterprise-grade, production-quality cross-platform application spanning road freight dispatch staging, digital gate pass issuance, terminal billing ledger settlement, customer advance pool accounting, credit risk monitoring, and executive fiscal oversight.

The system must run from a single, unified codebase across:

1. **Android** (Handheld loading dock terminals, mobile phones, rugged warehouse scanners)
2. **iOS** (iPhones, iPads for yard operations and executive monitoring)
3. **Web** (Desktop workstations, office terminals, dispatch monitors)

### Core Technologies:

- **Runtime:** React Native 0.86+ on React 19.2+
- **Platform Toolchain:** Expo SDK 57 (`https://docs.expo.dev/versions/v57.0.0/`)
- **Navigation Engine:** Expo Router v4+ (File-system routing with route groups)
- **Language:** TypeScript (Strict mode)
- **Styling:** React Native StyleSheets paired with NativeWind v4 where utility classes provide clean responsive composability without platform abstraction leaks
- **Web Execution:** React Native Web (Directly compiling primitives to standard web DOM elements)

The **Google Stitch design** remains the definitive visual and interaction source of truth.

---

## 2. Source of Truth Priority

When resolving implementation decisions, architectural choices, styling disputes, or behavioral questions, engineers and agents must adhere strictly to the following hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│                 SOURCE OF TRUTH HIERARCHY                   │
├─────────────────────────────────────────────────────────────┤
│ 1. Explicit Product Requirements (User Instructions)        │
│    ↓                                                        │
│ 2. Stitch Design System & Screens (MCP Tool Data)           │
│    ↓                                                        │
│ 3. docs/DESIGN.md (Comprehensive UI/UX Specification)       │
│    ↓                                                        │
│ 4. docs/ARCHITECTURE.md (Engineering & Code Rules)          │
│    ↓                                                        │
│ 5. Existing Project Codebase                                │
│    ↓                                                        │
│ 6. Developer Implementation Judgment                        │
└─────────────────────────────────────────────────────────────┘
```

### Ambiguity Handling Protocol:

- **Never invent product functionality** or business rules that are not supported by the Stitch design or documented requirements.
- If a requirement is underspecified (e.g. multi-currency fallback, multi-leg consignment routing):
  1. Explicitly identify and isolate the ambiguity.
  2. Adopt the smallest reasonable, non-breaking assumption that preserves visual fidelity and system safety.
  3. Document the assumption in the codebase comments and project documentation.
  4. Do not silently fabricate complex features, fake backend behaviors, or speculative UI paths.

---

## 3. Directory Architecture

To maintain clear separation of concerns, high discoverability, and clean boundaries between routing, UI presentation, domain logic, and data access, the project structure is standardized as follows:

```
c:\my-app/
├── app/                              # Expo Router file-system routing root
│   ├── _layout.tsx                   # Global app provider shell (Theme, Auth, Safe Area)
│   ├── index.tsx                     # Root entrypoint / role router redirector
│   ├── (auth)/                       # Public authentication & role onboarding routes
│   │   ├── _layout.tsx               # Auth stack layout
│   │   ├── login.tsx                 # Staff login & credentials entry
│   │   └── select-role.tsx           # Role switcher fallback
│   ├── (supervisor)/                 # Supervisor dock operations route group
│   │   ├── _layout.tsx               # Supervisor layout (Mobile tab bar + Desktop header)
│   │   ├── dispatch.tsx              # Outbound staging & trip registration form
│   │   ├── gate-pass.tsx             # Digital gate pass issuance & proof verification
│   │   └── loads.tsx                 # Dock loads list (Read-only, rates masked)
│   ├── (office)/                     # Office billing & finance route group
│   │   ├── _layout.tsx               # Office layout (Desktop split-pane + Mobile tabs)
│   │   ├── billing.tsx               # Office billing workspace & rate calibration
│   │   ├── advances.tsx              # Customer advance pool deposits (ADV-1)
│   │   └── credits.tsx               # Receivables ledger & credit terms tracker
│   └── (owner)/                      # Executive command center route group
│       ├── _layout.tsx               # Owner layout (Desktop sidebar + Mobile tabs)
│       ├── dashboard.tsx             # Executive fiscal dashboard & overdue monitoring
│       ├── audit.tsx                 # Master consignment audit log & stream search
│       └── settings/
│           └── products.tsx          # Master SKU product catalog & base rate manager
│
├── components/                       # Pure presentation & UI components (NO routing here)
│   ├── ui/                           # Primitives (Button, Text, Input, Badge, Card, Modal)
│   ├── forms/                        # Composite form inputs (NumericInput, SearchBar, Dropzone)
│   ├── navigation/                   # DesktopSidebar, MobileBottomNav, RoleSwitcherPills, Header
│   ├── feedback/                     # LoadingSpinner, EmptyState, ErrorBanner, ToastFeedback
│   └── domain/                       # Specialized business components (ManifestTable, KPICard,
│                                     # AdvanceOffsetStrip, PaymentModeToggle, OverdueAccountRow)
│
├── constants/                        # Centralized design tokens & configuration
│   ├── colors.ts                     # Semantic color palette extracted from Stitch designMd
│   ├── typography.ts                 # Font sizes, line heights, letter spacings, weights
│   ├── spacing.ts                    # 8px rhythmic spacing scale and container dimensions
│   ├── breakpoints.ts                # Screen size breakpoint thresholds (Mobile, Tablet, Desktop)
│   └── config.ts                     # App constants, defaults, regulatory tax codes (HSN/GST)
│
├── hooks/                            # Custom React hooks (useResponsive, useLoads, useBilling)
│   ├── useResponsive.ts              # Breakpoint detection & window dimensions
│   ├── useRoleContext.ts             # Active role context & permission checks
│   ├── useConsignments.ts            # Consignment state & CRUD operations
│   └── useDebounce.ts                # Debounced search input handler
│
├── services/                         # Business logic, storage & API communication
│   ├── api/                          # Network client & endpoints (mockable contract)
│   │   ├── client.ts                 # Base HTTP/fetch client wrapper
│   │   ├── loadsApi.ts               # Consignment & manifest endpoints
│   │   ├── billingApi.ts             # Billing, advance deduction & settlement endpoints
│   │   └── productsApi.ts            # Master SKU catalog endpoints
│   └── storage/                      # Local persistence (AsyncStorage wrapper)
│       ├── storageService.ts         # Type-safe key-value persistence
│       └── offlineQueue.ts           # Offline dispatch queue for dock terminals
│
├── types/                            # Domain TypeScript type definitions
│   ├── models.ts                     # Load, Consignment, ProductSKU, AdvanceVoucher, Payment
│   ├── roles.ts                      # Staff roles ('supervisor' | 'office' | 'owner')
│   ├── navigation.ts                 # Route params and navigation contracts
│   └── theme.ts                      # Token definitions and style interfaces
│
├── utils/                            # Pure helper functions
│   ├── currency.ts                   # Indian Rupee (₹) and US Dollar ($) formatters
│   ├── date.ts                       # Date & timestamp formatters (IST, relative time)
│   ├── validation.ts                 # Form validation rules (phone numbers, VINs, GSTIN)
│   └── calculation.ts                # Manifest totals, advance offset deduction, margins
│
├── assets/                           # Static assets
│   ├── images/                       # Outbound cargo photos, placeholders, slip mocks
│   └── icons/                        # FleetBill vector logo SVG and brand icons
│
└── docs/                             # Engineering & architectural documentation
    ├── DESIGN.md                     # Visual design system & screen inventory
    └── ARCHITECTURE.md              # Engineering specification & rules (this file)
```

---

## 4. Routing Architecture

Routing is governed strictly by **Expo Router v4+** with file-system conventions.

### Rules of Routing:

1. **Screen Independence:** Reusable UI components, complex business calculation functions, or data stores must **never** be defined inside the `app/` directory. Files in `app/` must only configure layouts and screen compositions.
2. **Route Groups:** Logical functional boundaries are established using parenthesis-enclosed route groups:
   - `(auth)`: Login and role onboarding.
   - `(supervisor)`: Loading dock staging, manifest checks, gate passes.
   - `(office)`: Rate calibration, advances, payment ledger.
   - `(owner)`: Fiscal dashboard, overdue debts, SKU catalog.
3. **No Platform Screen Duplication:** Do not create separate screen files for Web vs. Mobile (e.g. `billing.web.tsx` vs `billing.mobile.tsx`). Instead, write a single screen file (`billing.tsx`) that conditionally renders desktop or mobile compositions via `useResponsive()` or responsive NativeWind containers.
4. **Platform Extensions Policy:** Platform-specific file extensions (`.web.tsx`, `.native.tsx`, `.ios.tsx`, `.android.tsx`) are permitted **only** when an underlying native module differs fundamentally (e.g. native camera hardware access vs. web file upload drag-and-drop). When introduced, both platform files must implement the exact same TypeScript prop interface.

---

## 5. Component Architecture

Components must be categorized strictly according to scope and reuse:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT TAXONOMY                              │
├───────────────────┬────────────────────────────────────────────────────┤
│ Category          │ Scope, Responsibilities & Examples                 │
├───────────────────┼────────────────────────────────────────────────────┤
│ A. Primitive UI   │ Zero business logic, highly reusable styling blocks│
│    (components/ui)│ Button, Text, TextInput, Card, Badge, Modal,       │
│                   │ Divider, Pill, Icon                                │
├───────────────────┼────────────────────────────────────────────────────┤
│ B. Composite      │ Generalized interactive patterns with local UI     │
│    (components/   │ state but no specific domain entities:             │
│     forms,        │ SearchBar, SegmentedToggle, FileDropzone,          │
│     navigation)   │ DesktopSidebar, MobileBottomNav, StatCard, Header   │
├───────────────────┼────────────────────────────────────────────────────┤
│ C. Domain         │ Tied directly to logistics and billing data:       │
│    (components/   │ ManifestTable, AdvanceOffsetStrip, PaymentSelector,│
│     domain)       │ ConsignmentRow, OverdueAccountCard, SKUItemCard    │
└───────────────────┴────────────────────────────────────────────────────┘
```

### Component Design Principles:

- **Single Responsibility:** Each component must perform exactly one function. Avoid monolithic 800-line screen components.
- **Controlled Abstraction:** Avoid creating micro-components for single-use elements; only abstract components that repeat or encapsulate clean sub-states.
- **Explicit Typing:** Every component must declare an explicit TypeScript interface for its props. Never use implicit `any`.

---

## 6. Design Tokens & Styling Strategy

Design tokens are extracted directly from `docs/DESIGN.md` and centralized under `constants/`.

### Rules:

- **No Hardcoded Values:** Never scatter arbitrary hex codes (`#0f172a`), font sizes (`13px`), or spacing margins (`16px`) across component files.
- **Centralized Token References:** All styles must reference:
  - `constants/colors.ts` for semantic palette tokens.
  - `constants/typography.ts` for font sizes, line heights, and weights.
  - `constants/spacing.ts` for paddings, gaps, and dimensions.
- **Preservation of Stitch Values:** Stitch exact tokens (e.g. `#0F172A`, `#2563EB`, `#059669`, `#D97706`, `#E11D48`, `#7C3AED`, `#0284C7`) must be preserved verbatim. Do not substitute them with generic Tailwind color equivalents.
- **NativeWind Usage:** Use NativeWind utility classes where they simplify responsive flex layouts, borders, and paddings; for complex cross-platform platform calculations (such as dynamic table columns or custom elevation), use structured React Native `StyleSheet.create`.

---

## 7. Responsive Design Strategy

The application must support screen viewports from 360px mobile displays up to 4K desktop screens without breaking layout integrity.

### Responsive Principles:

1. **Adaptive Composition over Downscaling:** Mobile is not simply a shrunken desktop screen. As specified in `DESIGN.md`:
   - **Office Billing:** Desktop displays a 2-column split (Left: customer list, Right: calibration panel); Mobile renders a vertically stacked flow with customer cards at the top and the active calibration workcard below.
   - **Supervisor Staging:** Desktop utilizes an 8-column form + 4-column dock monitor sidebar; Mobile renders a single compact card flow with a camera proof tile and a sticky gate pass trigger.
   - **Data Tables:** Desktop uses dense tabular grids (`table-row-h-dense: 36px`); Mobile translates rows into structured summary cards with flex-end status pills.
2. **Breakpoints Definition:**
   - `mobile`: `< 768px`
   - `tablet`: `768px - 1023px`
   - `desktop`: `>= 1024px`
3. **Hook-Driven Layout Selection:** Components query `const { isDesktop, isMobile } = useResponsive()` to conditionally render the appropriate layout shell while sharing child components and state controllers.

---

## 8. Web Implementation Standard

React Native Web is an essential, first-class deployment target.

### Web Rules:

- **No Browser Leaks in Shared Code:** Do not directly access `window`, `document`, `navigator`, or `localStorage` inside shared component files.
- **Platform Isolation:** When web-specific capabilities are required (such as triggering an instant file download for CSV export or printing a pro-forma invoice):
  - Encapsulate the behavior inside a utility module (`utils/export.web.ts` vs `utils/export.native.ts`).
- **Web Desktop Fidelity:** The web experience running on desktop viewports must faithfully recreate the Stitch desktop layout, including the 16rem persistent sidebar, top navigation breadcrumbs, and dense multi-column tables.
- **Pointer and Hover States:** Hover effects (`hover:bg-slate-50`, cursor pointer) must be functional on web while remaining inert on native touch screens.

---

## 9. Mobile Implementation Standard

The mobile experience must deliver native-grade fluid performance on iOS and Android.

### Mobile Rules:

- **Native Scrolling Primitives:**
  - Use `FlatList` for dynamic feeds (Dock loads, Consignment streams, Product SKU lists) to ensure virtualization and memory efficiency.
  - Use `ScrollView` for structured forms and fixed multi-section screens.
  - Set `keyboardShouldPersistTaps="handled"` on scrollable form containers.
- **Safe Area Insets:** All screens must properly incorporate `useSafeAreaInsets()` from `react-native-safe-area-context` to respect notches, dynamic islands, and home indicator bars.
- **Touch Targets:** Interactive elements must provide a minimum tap target of `44px × 44px`.
- **Keyboard Handling:** Wrap complex forms in `KeyboardAvoidingView` with platform-specific behavior (`behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`).

---

## 10. State Management Architecture

State complexity must be kept minimal and colocated.

### State Tiering:

1. **Local Screen / Component State (`useState`, `useReducer`):**
   - Transient UI states: form inputs, row expansion, modal visibility, active filter tab, camera capture previews.
2. **Feature / Shared Context State (`React.createContext`):**
   - `RoleContext`: Current active operational role (`supervisor` | `office` | `owner`) and active dock bay.
   - `ConsignmentsContext`: Today's consignment records, active calibrating load ID, and ledger mutations.
   - `ProductCatalogContext`: Live master SKU catalog and default rate mappings.
3. **Persistent Local State (`AsyncStorage`):**
   - Active staff role preference, offline queued gate passes, cached product master data.
4. **No Heavy External State Libraries:** Do not install or introduce Redux, Zustand, MobX, or similar libraries unless actual architectural scaling requirements formally demand it.

---

## 11. Data / API Architecture

UI components must remain strictly decoupled from networking and remote data fetching.

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW PIPELINE                       │
├─────────────────────────────────────────────────────────────┤
│ UI View Component (e.g. OfficeBillingWorkspace)             │
│    ↓                                                        │
│ Custom Hook (e.g. useBillingLedger)                         │
│    ↓                                                        │
│ Service Layer (e.g. billingApi.ts)                          │
│    ↓                                                        │
│ Data Adapter / Network Client (HTTP / Mock Store)           │
└─────────────────────────────────────────────────────────────┘
```

### Data Rules:

- **No Direct API Calls in Components:** Never perform `fetch()` or async network requests directly within UI component rendering logic.
- **Isolated Mock Data:** During UI development and local testing, mock datasets must reside in `services/api/mockData.ts` with typed interfaces matching production models.
- **Swappable Contracts:** Services must return standardized `Promise<ApiResponse<T>>` objects so that mock adapters can be replaced with real backend endpoints without modifying UI components.

---

## 12. Authentication & Authorization

### Architecture:

- Presentation code must remain agnostic of credential storage and token refresh mechanics.
- Role-based routing is managed via Expo Router route protection inside `app/_layout.tsx`.
- The prototype interactive role switcher (`Supervisor` | `Office Admin` | `Owner Console`) is encapsulated inside `RoleContext`. In production, this context will be populated from staff session tokens.
- **Rate Masking Enforcement:** Authorization rules are enforced at both the hook and component level. For users in the `supervisor` role, financial rate properties are completely omitted or masked (`Rates masked`) before being passed to presentation views.

---

## 13. Form Handling & Validation

### Form Rules:

- **Controlled Inputs:** All form inputs (`TextInput`, numeric fields, radio selectors) must be controlled via React state or lightweight form handlers.
- **Numeric Sanitization:** Line item quantities, unit rates, and advance offsets must sanitize non-numeric characters and format cleanly with commas.
- **Centralized Validation Rules:** Form validation routines (driver phone 10-digit check, vehicle registration format, required customer names) must reside in `utils/validation.ts` and be shared across screens.
- **Responsive Layout:** Multi-column form fields must stack gracefully into single-column inputs on mobile devices.

---

## 14. Accessibility Standards

All user-facing components must comply with WCAG 2.1 AA accessibility guidelines:

- **Labels:** Provide descriptive `accessibilityLabel` attributes on all icon-only buttons (e.g. search, close, delete, notifications, sync).
- **Roles:** Assign explicit `accessibilityRole` (`button`, `header`, `search`, `tab`, `image`, `alert`).
- **States:** Supply `accessibilityState={{ selected: boolean, disabled: boolean }}` on tabs, pills, and toggles.
- **High Contrast:** Semantic text tokens must strictly maintain minimum 4.5:1 contrast ratios against their respective container surfaces.

---

## 15. Performance Guidelines

1. **Virtualized Lists:** Always use `FlatList` with `keyExtractor` and `getItemLayout` for long consignment lists and product catalogs.
2. **Render Optimization:** Wrap expensive composite list items in `React.memo` where frequent parent re-renders occur (e.g. rapid numeric input calibration).
3. **Image Optimization:** Use `expo-image` for cargo photos and gate seal captures to leverage automatic disk caching, placeholder blurhashes, and responsive sizing.
4. **Tree Depth:** Maintain shallow component hierarchies; avoid redundant wrapping `View` containers.

---

## 16. Error, Loading, and Empty States

Every data-consuming screen must explicitly account for four lifecycle states:

1. **Loading:** Render standard skeleton loaders or themed spinning indicators (`components/feedback/LoadingSpinner.tsx`). Never leave a frozen or blank screen.
2. **Success:** Render the structured UI matching the Stitch visual specification.
3. **Empty:** Render themed empty state containers (`components/feedback/EmptyState.tsx`) featuring an explanatory icon, heading, and action button (e.g. "No consignments found. Stage a new load.").
4. **Error:** Display actionable inline error banners (`components/feedback/ErrorBanner.tsx`) with a `Retry` action trigger.

---

## 17. Security Policy

1. **Zero Secret Storage in Code:** API keys, private certificates, and secrets must never be committed to source code or hardcoded in repositories.
2. **Public Variable Caution:** Never place sensitive credentials inside `EXPO_PUBLIC_*` environment variables, as these are embedded directly in client-side bundles.
3. **Client-Side Validation Disclaimer:** Client-side validation is strictly for user experience; backend systems must independently validate all financial offsets, rate calculations, and gate pass submissions.

---

## 18. Dependency Policy

To ensure project stability, small bundle sizes, and seamless upgrades:

1. **Capability Hierarchy:**
   - First check if **React Native core** provides the capability.
   - Next check if **Expo SDK 57 built-in packages** support it.
   - Check if an already-installed dependency in `package.json` fulfills the need.
   - Only propose a new dependency if none of the above can satisfy the requirement.
2. **Strict Vetting:** Every newly proposed package must support Web, Android, and iOS equally without requiring custom native binary linkers that break Expo Go or web compilation.

---

## 19. Code Quality & Standards

- **TypeScript Strictness:** Strict mode enabled. The use of `any` is strictly prohibited; use typed generics or `unknown` with type guards.
- **Naming Conventions:**
  - Components: PascalCase (`OfficeBillingWorkspace.tsx`, `ManifestTable.tsx`)
  - Hooks: camelCase starting with `use` (`useResponsive.ts`, `useBilling.ts`)
  - Constants: UPPER_SNAKE_CASE for static values; camelCase for token objects (`COLORS`, `SPACING`)
  - Types / Interfaces: PascalCase (`Consignment`, `LineItem`, `PaymentMode`)
- **No Dead Code:** Commented-out obsolete code, debug console logs, and unnecessary `@ts-ignore` flags are prohibited in production branches.

---

## 20. Stitch Fidelity Standards

The Google Stitch design is the exact visual target.

- **Preserve Visual Rhythms:** Preserve hairline borders (1px), subtle divider contrast (`#F1F5F9`), and unboxed flat metric layouts.
- **Preserve Typography Weights:** Maintain the distinction between 600-weight headings, 500-weight tabular numerals, and 400-weight data cells.
- **Preserve Proportions:** Maintain explicit heights (32px compact inputs, 36px standard controls, 56px headers, 256px sidebars).
- **No Arbitrary Redesigns:** Never redesign or restyle an interface element simply because another design paradigm is preferred.

---

## 21. Screen Implementation Process

Every screen in the project must be implemented following this disciplined 13-step progression:

```
┌─────────────────────────────────────────────────────────────┐
│                 SCREEN IMPLEMENTATION CYCLE                 │
├─────────────────────────────────────────────────────────────┤
│  1. Inspect corresponding Stitch screen & metadata          │
│  2. Read relevant docs/DESIGN.md section                    │
│  3. Identify reusable UI & domain components                │
│  4. Identify exact design tokens (colors, spacing, type)    │
│  5. Implement screen layout & responsive container          │
│  6. Implement form fields, tables, & action controls        │
│  7. Implement interactive state transitions                 │
│  8. Run Expo local environment                              │
│  9. Test & verify Mobile layout (Android/iOS)               │
│ 10. Test & verify Desktop Web layout                        │
│ 11. Compare visually against Stitch screenshots             │
│ 12. Fix visual and functional discrepancies                 │
│ 13. Mark screen complete and proceed to next screen         │
└─────────────────────────────────────────────────────────────┘
```

---

## 22. Agent Behavior Rules

When acting autonomously on this codebase, the agent must obey these mandatory behavioral constraints:

1. **Inspect Before Modifying:** Always view existing file contents before proposing modifications.
2. **Non-Destructive Editing:** Never overwrite working implementations or delete existing functionality without explicit user instructions.
3. **No Duplicate Components:** Before creating a new component, verify whether an existing primitive in `components/ui/` or `components/domain/` already provides that capability.
4. **No Spurious Dependencies:** Never run package installations (`npm install` / `npx expo install`) without demonstrating clear necessity and user alignment.
5. **No Invented Backend Logic:** Never write fake backend server engines or mock databases in the production application root.
6. **Preserve Stitch System:** Never modify or edit the Stitch source design schemas directly.

---

## 23. Testing & Verification Standard

After any meaningful code change, the following verification gates must be satisfied:

- **TypeScript Compilation:** Zero type errors (`npx tsc --noEmit`).
- **Expo Web Compilation:** App compiles and boots cleanly on Web without DOM or React runtime errors.
- **Expo Mobile Compilation:** App compiles and renders cleanly on Android/iOS emulators or devices.
- **Interaction Verification:** Buttons trigger corresponding state updates, inputs accept text/numbers, and modals open/close as designed.
- **Responsive Verification:** Resizing the browser window smoothly transitions between mobile card stacks and desktop multi-column tables.

---

## 24. Definition of Done

A task or feature is **only** considered complete when all of the following conditions are met:

- [ ] Visual appearance closely matches the corresponding Google Stitch screen design.
- [ ] Screen renders responsively on Mobile (< 768px) and Desktop (>= 1024px).
- [ ] Navigation transitions correctly within Expo Router hierarchy.
- [ ] All interactive states (hover, active press, disabled, loading, success) operate as specified.
- [ ] Loading, Empty, and Error states are implemented and verified.
- [ ] TypeScript passes with zero errors and no unchecked `any` types.
- [ ] No unhandled exceptions or warnings appear in the application console.
- [ ] The codebase adheres strictly to the directory structure and naming conventions defined in this document.

---

## 25. Scope Control & Current Status

This document establishes the architecture foundation. As instructed:

- **No application code has been implemented yet.**
- **Existing project files remain untouched.**
- **Implementation will proceed strictly according to the 12-stage roadmap outlined in DESIGN.md upon user authorization.**
