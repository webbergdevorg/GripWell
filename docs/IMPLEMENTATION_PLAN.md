# Gripwell — Master Implementation Plan

> **Application Name:** Gripwell (Modern Billing App)  
> **Source Platform:** Google Stitch Project `4970474604554189402`  
> **Design Specification:** [docs/DESIGN.md](file:///c:/my-app/docs/DESIGN.md)  
> **Architecture Specification:** [docs/ARCHITECTURE.md](file:///c:/my-app/docs/ARCHITECTURE.md)  
> **Target Framework:** React Native 0.86+ / Expo SDK 57 / Expo Router v4 / React Native Web / NativeWind v4  
> **Target Platforms:** Android, iOS, Web  
> **Document Version:** 1.0.0 — Baseline Implementation Plan

---

## 1. Project Audit Summary

### 1.1 Existing Codebase State

An audit of the workspace reveals the following current state:

- **Expo Framework:** Expo SDK 57 (`~57.0.21`) with React Native `0.86.3` and React `19.2.3`.
- **Navigation:** Expo Router `~57.0.20` is installed.
- **Styling Pipeline:** NativeWind `^4.2.6` and Tailwind CSS `^3.4.19` are installed with `tailwind.config.js` configured for `./app` and `./components`.
- **Existing App Directories:**
  - `app/tabs/`: Contains boilerplate placeholder files (`_layout.tsx`, `index.tsx`).
  - `src/app/`: Contains default template files (`_layout.tsx`, `explore.tsx`, `index.tsx`).
  - _Resolution:_ Per `ARCHITECTURE.md`, routing must be standardized under `app/` with clean route groups `(supervisor)`, `(office)`, `(owner)`. Legacy boilerplate in `src/app` and `app/tabs` will be safely cleaned up before new route initialization.
- **Components Directory:** Currently contains placeholder empty files (`colors.ts`, `config.ts`, `fonts.ts`). These will be structured according to the component taxonomy (`components/ui`, `components/forms`, `components/navigation`, `components/domain`).

### 1.2 Dependency Audit

- **Already Installed & Available:**
  - `@expo/vector-icons` (`^15.0.2`) — Full support for Material Icons, Material Symbols, and Feather.
  - `@react-native-async-storage/async-storage` (`2.2.0`) — Key-value local caching and offline dispatch queue.
  - `expo-image` (`~57.0.4`) — High-performance image rendering with grayscale filtering and disk cache.
  - `expo-font` (`~57.0.3`) — Inter font family loading.
  - `react-native-safe-area-context` (`~5.7.0`) — Native mobile notch, dynamic island, and home indicator padding.
  - `react-native-screens` (`~4.26.0`) & `react-native-reanimated` (`4.5.1`) — Native navigation transitions and animations.
  - `react-native-web` (`~0.21.0`) — Complete desktop web runtime.
- **Dependencies Genuinely Required:**
  - **None.** All necessary libraries for cross-platform execution, styling, icons, images, storage, and navigation are **already installed**. No new packages need to be added.

---

## 2. Screen Implementation Order

Screens will be implemented in priority order, moving from core transactional workspaces to executive consolidation, verifying each screen on both desktop web and mobile before progressing to the next.

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                SCREEN IMPLEMENTATION SEQUENCE                              │
├──────┬────────────────────────────────────┬─────────────────┬──────────────────────────────┤
│ Step │ Screen Target                      │ Platforms       │ Focus & Deliverables         │
├──────┼────────────────────────────────────┼─────────────────┼──────────────────────────────┤
│ 1    │ Office Billing Workspace (Minimal) │ Desktop & Mobile│ Core financial ledger, rate  │
│      │                                    │                 │ calibration, advance offset, │
│      │                                    │                 │ payment modes, receipt upload│
├──────┼────────────────────────────────────┼─────────────────┼──────────────────────────────┤
│ 2    │ Supervisor Workspace (Minimal)     │ Desktop & Mobile│ Outbound dispatch staging,   │
│      │                                    │                 │ manifest verification, cargo │
│      │                                    │                 │ rear photo, gate pass issuance│
├──────┼────────────────────────────────────┼─────────────────┼──────────────────────────────┤
│ 3    │ Owner Fiscal Dashboard (Minimal)   │ Desktop & Mobile│ 4-pillar financial metrics,  │
│      │                                    │                 │ overdue accounts table,      │
│      │                                    │                 │ credit freeze, audit stream  │
├──────┼────────────────────────────────────┼─────────────────┼──────────────────────────────┤
│ 4    │ Owner Settings: Manage Products    │ Mobile (Desktop │ Master SKU product catalog,  │
│      │                                    │ adaptive)       │ quick-add drawer, base rates,│
│      │                                    │                 │ unit metrics, HSN codes      │
├──────┼────────────────────────────────────┼─────────────────┼──────────────────────────────┤
│ 5    │ Credit & Advance Ledger (Extended) │ Desktop & Mobile│ Detailed debt aging analysis,│
│      │                                    │                 │ customer advance deposit pool│
└──────┴────────────────────────────────────┴─────────────────┴──────────────────────────────┘
```

---

## 3. Shared Components Plan

Components are designed according to repetition across the Stitch designs and separated into 4 distinct layers:

### 3.1 Primitive UI Components (`components/ui/`)

1. **`Text.tsx`:** Standardized typography component enforcing Stitch hierarchy (`headline-xl`, `headline-lg`, `headline-md`, `headline-sm`, `body-lg`, `body-md`, `body-sm`, `label-md`, `label-sm`, `tabular-data`).
2. **`Button.tsx`:** Multi-variant interactive button (`primary` [Slate 900], `secondary` [Slate 100], `outline` [Slate 200 border], `destructive` [Rose 50/600], `ghost`) with active scale (`scale-98`) and disabled states.
3. **`TextInput.tsx`:** Controlled text and numeric field supporting prefix currency adornment (`₹`), clear button, focus rings, and monospace numerals.
4. **`Badge.tsx`:** Status chips supporting exact Stitch semantic styles: `Paid` (Emerald), `Pending` (Amber), `Credit` (Violet), `Settled` (Emerald), `Calibrating` (Blue), `Overdue` (Rose).
5. **`Card.tsx`:** Container with subtle 1px hairline border (`#E2E8F0`), Level 1 micro-shadow (`shadow-xs`), and optional header/body padding.
6. **`Divider.tsx`:** 1px hairline horizontal divider (`#F1F5F9` or `#E2E8F0`).

### 3.2 Navigation & Structure Components (`components/navigation/`)

1. **`RoleSwitcherPills.tsx`:** The signature Stitch 3-way control (`Supervisor` | `Office Admin` | `Owner Console`) driving operational view states and permissions.
2. **`DesktopHeader.tsx`:** Sticky 56px desktop bar featuring brand logo, global search, terminal indicator (`Chicago Metro Hub`), and staff profile.
3. **`DesktopSidebar.tsx`:** 16rem persistent control panel with Operations group (`Fleet Feeds`, `Carrier Directory`, `Discrepancy Audit`) and Financial Core group.
4. **`MobileHeader.tsx`:** Compact 48px header displaying operational context (e.g. `Dock Bay 3 / Supervisor`, `Rates masked`) and search triggers.
5. **`MobileBottomNav.tsx`:** Sticky safe-area bottom navigation bar for mobile handheld usage.

### 3.3 Composite Form Components (`components/forms/`)

1. **`SegmentedToggle.tsx`:** 3-way or 4-way single-select pill toggle for payment modes (`Cash`, `UPI / NEFT`, `Credit Net-15`, `Bank Transfer`) and filter tabs.
2. **`FileUploadDropzone.tsx`:** Dashed border container for payment slip uploads and cargo seal photo attachments with thumbnail preview.
3. **`SearchBar.tsx`:** Compact search input with leading icon and instant filtering.

### 3.4 Domain Components (`components/domain/`)

1. **`KPICard.tsx`:** Unboxed flat metric block and boxed card displaying large tabular numbers (₹24,100, ₹15,600) with sub-labels.
2. **`ManifestTable.tsx`:** Dynamic line-item grid supporting row addition, unit selection, quantity adjustments, rate editing, and item deletion.
3. **`AdvanceOffsetStrip.tsx`:** Customer advance deposit display with offset input and one-click `Apply ₹5,000` / `Remove` toggle.
4. **`OverdueAccountRow.tsx`:** Overdue customer item displaying net due, terms aging alert, driver assignment, and `Freeze Credit` action.

---

## 4. Navigation Architecture Plan

Expo Router route tree mapping directly to roles and workflows:

```
app/
├── _layout.tsx                     # Global App Shell (Inter font loader, RoleContext, Safe Area)
├── index.tsx                       # Redirects to active role home screen
│
├── (supervisor)/                   # Dock Supervisor Workspace
│   ├── _layout.tsx                 # Supervisor layout (Mobile top/bottom nav + Desktop shell)
│   ├── dispatch.tsx                # Outbound truck staging form & manifest builder [DONE]
│   ├── gate-pass.tsx               # Digital gate pass issuance (#GP-04) & seal proof [DONE]
│   └── loads.tsx                   # Dock loads stream (Read-only, rates masked)
│
├── (office)/                       # Office Billing & Settlement
│   ├── _layout.tsx                 # Office layout (Desktop split-pane + Mobile tabs)
│   ├── billing.tsx                 # Rate calibration & line-item settlement ledger
│   ├── advances.tsx                # Customer advance deposit management (ADV-1)
│   └── credits.tsx                 # Receivables ledger & credit tracker
│
└── (owner)/                        # Business Owner & Executive Console
    ├── _layout.tsx                 # Owner layout (Desktop sidebar + Mobile tabs)
    ├── dashboard.tsx               # 4-Pillar fiscal dashboard & overdue accounts
    ├── audit.tsx                   # Master consignments reconciliation log
    └── settings/
        └── products.tsx            # Master SKU catalog & base rate manager
```

---

## 5. Responsive Layout Strategy

The application avoids separate codebases for Web and Mobile by using **adaptive component composition**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ADAPTIVE LAYOUT MATRIX                                      │
├──────────────────────┬────────────────────────────────────┬────────────────────────────────┤
│ Feature Area         │ Desktop Viewport (>= 1024px)       │ Mobile Viewport (< 768px)      │
├──────────────────────┼────────────────────────────────────┼────────────────────────────────┤
│ Shell Structure      │ Persistent 16rem sidebar + top nav │ Sticky context bar + bottom nav│
│ Office Billing       │ Asymmetric 2-column split-pane     │ Vertical stack: loads on top,  │
│                      │ (5-col list, 7-col workpanel)      │ calibration card below         │
│ Supervisor Staging   │ 8-col form + 4-col dock monitor    │ Single-column card stack with  │
│                      │ sidebar                            │ compact camera tile            │
│ Financial Metrics    │ Flat 4-column horizontal strip     │ 2×2 metric grid with badges    │
│ Data Tables          │ Multi-column table with borders    │ Stacked cards with key-values  │
│ SKU Creation         │ Slide-over panel / modal dialog    │ In-flow collapsible card drawer│
└──────────────────────┴────────────────────────────────────┴────────────────────────────────┘
```

The responsive state is driven by a unified hook `useResponsive()` returning `{ isMobile, isTablet, isDesktop, width }`.

---

## 6. Implementation Sequence

The work will proceed through structured, verifiable checkpoints:

### Phase 1: Project Audit & Plan (Current Step)

- [x] Audit workspace, dependencies, existing code, and Stitch designs.
- [x] Formulate comprehensive implementation plan (`docs/IMPLEMENTATION_PLAN.md`).

### Phase 2: Design Tokens & Typography Foundation

- Create `constants/colors.ts` with exact Stitch hex tokens (`#0F172A`, `#2563EB`, `#059669`, `#D97706`, `#E11D48`, `#7C3AED`, `#0284C7`).
- Create `constants/typography.ts` with font sizes, line heights, letter spacings, and tabular font features.
- Create `constants/spacing.ts` and `constants/breakpoints.ts`.
- Set up font loader for `Inter` family in `app/_layout.tsx`.

### Phase 3: Primitive UI Components

- Implement core primitives in `components/ui/` (`Text`, `Button`, `TextInput`, `Badge`, `Card`, `Divider`).
- Implement composite controls in `components/forms/` (`SegmentedToggle`, `FileUploadDropzone`, `SearchBar`).
- Implement feedback states in `components/feedback/` (`LoadingSpinner`, `EmptyState`, `ErrorBanner`).

### Phase 4: Navigation Shell & Role Engine

- Implement `RoleContext` supporting active role switching (`Supervisor`, `Office Admin`, `Owner Console`).
- Implement `RoleSwitcherPills.tsx`.
- Implement responsive app layouts with `useResponsive()`.

### Phase 5: Screen 1 — Office Billing Workspace (Minimal Desktop & Mobile)

- Implement line-item pricing table with quantity/rate math.
- Implement customer advance pool deduction logic (`ADV-1`).
- Implement settlement mode radio selection and payment slip upload dropzone.
- Implement `Save to Ledger` visual confirmation.
- Verify across desktop web and mobile viewports against Stitch screen `277895d51ac945119fb724804ed80334` and `571fca4b975448be9623664b25e6fc40`.

### Phase 6: Screen 2 — Supervisor Workspace (Minimal Desktop & Mobile)

- Implement outbound truck staging form (Customer, Driver, Vehicle Reg, Load ID).
- Implement loaded manifest table with piece count summation and rate masking.
- Implement cargo rear photo preview tile and gate pass generation animation.
- Verify across desktop web and mobile viewports against Stitch screen `e9b548ccd0614c4189ec143905d33313` and `cc0a7d9be25f4b6fa0ea9a227bcb3f76`.

### Phase 7: Screen 3 — Owner Executive Fiscal Dashboard (Minimal Desktop & Mobile)

- Implement 4-pillar financial metrics (Valid Loads, Revenue, Pending, Credit Outstanding).
- Implement overdue accounts table with `Freeze Credit` action.
- Implement daily consignments log with real-time text filtering.
- Verify across desktop web and mobile viewports against Stitch screen `e4417dd385884672a2d0c906471e734c` and `e788725a610143499fffb7fc001b6ce9`.

### Phase 8: Screen 4 — Owner Settings: Manage Products (Mobile & Desktop Adaptive)

- [x] Implement master SKU product catalog with category filter chips.
- [x] Implement collapsible quick-add drawer (`#quickAddDrawer`) for new SKU creation.
- [x] Implement live base rate editing, stock adjustments, and CSV export.
- [x] Verify across desktop web and mobile viewports against Stitch screen `5f8452ef383a4b69b6ef73cf3549d3a4`.

### Phase 9: Screen 5 — Credit & Advance Ledger (Extended Desktop & Mobile)

- [x] Implement 4-Card Financial KPI header with progress indicators and status pills.
- [x] Implement Credit Accounts Ledger with particulars, vehicle specs, and advance offset strip.
- [x] Implement Customer Advance Deposits with 3-box balance meters and applied mapping trail.
- [x] Implement Split Payment & Credit Settlement Modal (`#settleModal`).
- [x] Implement Record Advance Payment Slide-over Drawer (`#advanceDrawer`).
- [x] Verify across desktop web and mobile viewports against Stitch screen `edd10a6def0445efb812fd869ef0800b`.

### Phase 10: Testing, Visual Verification & Final Polish

- [x] Full TypeScript strictness audit (`npx tsc --noEmit`).
- [x] Web rendering and responsiveness audit.
- [x] Mobile layout and touch interaction audit.

---

## 7. Testing & Verification Strategy

Each screen and component will be subjected to the following verification gates:

1. **TypeScript Static Analysis:** Strict type compliance with no unchecked `any`.
2. **Expo Web Bundling:** Live hot-reload testing on desktop, tablet, and mobile web viewports.
3. **Expo Native Verification:** Layout verification with safe area insets, virtualized scrolling, and touch responsiveness.
4. **Visual Comparison:** Side-by-side comparison against the Stitch screenshots downloaded via Stitch MCP to verify:
   - Font size and line-height alignment.
   - 1px hairline border rendering.
   - Status badge color accuracy.
   - Form input focus rings and padding.
   - Currency symbol placement (`₹`) and tabular numeral alignment.

---

## 8. Immediate Next Step

The first screen/component group to be implemented upon authorization is:

- **Phase 2 (Design Tokens & Typography)** followed immediately by **Phase 3 (Shared Primitive UI & Navigation Shell)** and **Phase 5 (Screen 1: Office Billing Workspace)**.
