# 🏢 EmNex Enterprise Design System & Visual Strategy

> **Design Persona:** Premium Corporate B2B & Executive Workforce / Field Operations SaaS  
> **Brand Anchors:** Precision, Authority, Operational Clarity, High Information Density without Fatigue  
> **Aesthetic Peers:** Linear, Stripe Billing, Rippling, Workday Enterprise, Ramp  

---

## 1. Brand Identity & Logo Architecture

The EmNex identity is designed to communicate institutional reliability, speed, and modern operational discipline to enterprise leaders, HR directors, and operations managers.

### 🔷 The Brand Mark & Wordmark Lockup
* **Logo Symbol:** `public/logo.png` — An angular, dual-link geometric emblem representing synchronized workforce scheduling and interconnected field operations.
* **Wordmark Composition:**
  * **"Em"** → **Deep Navy (`#0F172A`)** on light surfaces; **Pure White (`#FFFFFF`)** on dark sidebar surfaces. Represents stability, enterprise governance, and structure.
  * **"Nex"** → **Royal Blue (`#2563EB`)** in both light and dark contexts. Directly matches the vector fill of `logo.png`. Represents velocity, next-generation intelligence, and automated dispatch.
* **Proportions & Typography:**
  * Clean, geometric sans-serif (Inter), tracking `-0.025em` (tight), font weight `700` (Bold).
  * Icon-to-text vertical alignment: Exact optical center with `gap-2.5` (10px).

```text
[ ⬡ logo.png ]  EmNex
   #2563EB      #0F172A + #2563EB (Light)
   #2563EB      #FFFFFF + #2563EB (Dark / Sidebar)
```

---

## 2. Executive Color Architecture

Corporate enterprise applications fail when they use too many saturated colors. The EmNex system follows the **60-30-10 Corporate Ratio**:
* **60% Canvas & Neutrals:** Off-white canvas, pure white card surfaces, slate borders, and high-contrast typography.
* **30% Structural Deep Navy:** High-authority navigation sidebar, primary page titles, and dark contrast zones.
* **10% Interactive Royal Blue:** Deliberate, high-conversion action items, primary buttons, active states, and focus rings.

### 🎨 Core Color Palette

| Token Role | Hex Code | Tailwind / Token | Usage Context |
|---|---|---|---|
| **Primary Royal Blue** | `#2563EB` | `primary`, `text-[#2563EB]` | Primary CTAs, brand mark, active tabs, focus rings |
| **Primary Hover** | `#1D4ED8` | `hover:bg-[#1D4ED8]` | Primary button hover state |
| **Primary Active/Pressed** | `#1E40AF` | `active:bg-[#1E40AF]` | Primary button pressed/clicked state |
| **Soft Blue Tint** | `#EFF6FF` | `bg-[#EFF6FF]`, `accent` | Subtle active item backgrounds, icon container fills, secondary highlights |
| **Focus Halo Ring** | `#DBEAFE` | `ring-[#DBEAFE]` | Ambient keyboard focus boundary |
| **Executive Deep Navy** | `#0F172A` | `foreground`, `sidebar` | Sidebar background, primary headings, executive text |
| **Deep Slate Surface** | `#020617` | `bg-[#020617]` | Deep contrast backgrounds, modal scrims |
| **Slate Border Dark** | `#1E293B` | `border-[#1E293B]` | Dark sidebar dividers, dark mode card borders |
| **Canvas Background** | `#F8FAFC` | `background` | Main application viewport canvas (reduces eye strain) |
| **Surface Pure White** | `#FFFFFF` | `card`, `popover` | Cards, modals, data table containers, form inputs |
| **Hairline Border** | `#E2E8F0` | `border` | Precision card borders, table row dividers, top navigation border |
| **Input Inactive Border** | `#CBD5E1` | `input` | Form field unselected state |
| **Body Text** | `#334155` | `text-[#334155]` | Dense body text, readable paragraph copy |
| **Muted Caption Text** | `#64748B` | `muted-foreground` | Metadata, subtitles, column headers, timestamps |

---

## 3. Semantic & Financial Status Palette

In enterprise workforce, payroll, and dispatch software, status indicators must be universally unambiguous, accessible, and mathematically distinct from the brand blue:

| State | Badge BG | Badge Text & Dot | Hex | Purpose / Typical Data |
|---|---|---|---|---|
| **Success / Done** | `#F0FDF4` | `#16A34A` | `#16A34A` | Paid payroll, completed payments, completed tasks, active employees |
| **Approved / Signed off** | `#F5F3FF` | `#7C3AED` | `#7C3AED` | Approved payroll (not paid yet), approved tasks (not completed yet), approved work logs — kept apart from green so "approved" never reads as "paid" |
| **Pending / Review** | `#FFFBEB` | `#D97706` | `#D97706` | Awaiting approval, payroll draft, scheduled dispatch |
| **Critical / Rejected** | `#FEF2F2` | `#DC2626` | `#DC2626` | Failed payments, rejected submissions, overdue tasks |
| **Processing / Informational** | `#EFF6FF` | `#2563EB` | `#2563EB` | In progress, active processing, field transit |
| **Inactive / Archived** | `#F1F5F9` | `#64748B` | `#64748B` | Draft, canceled, archived projects, former staff |

* **Badge Styling Rule:** Keep badges compact and pill-shaped with a 6px status dot (`rounded-full px-2.5 py-0.5 text-xs font-medium border border-current/15`). Never use saturated solid backgrounds that distract from tabular data.

---

## 4. Typography & Information Hierarchy

Enterprise users scan dashboards rather than reading them like articles. Typography is optimized for high-density legibility and numerical comparison.

### 📐 Type Scale & Weights (Inter)
* **Page Titles:** `text-2xl font-bold tracking-tight text-[#0F172A]` (24px–28px)
* **Section Headers:** `text-lg font-semibold tracking-tight text-[#0F172A]` (18px)
* **Card Titles:** `text-sm font-medium text-[#64748B]` (14px)
* **KPI / Metric Figures:** `text-3xl font-bold tracking-tight text-[#0F172A] tabular-nums` (30px–36px)
* **Body / Table Content:** `text-sm font-normal text-[#334155]` (14px, line-height 1.5)
* **Overlines & Table Headers:** `text-xs font-semibold tracking-wider uppercase text-[#64748B]` (12px)

### 🔢 Tabular Figures Rule (`tabular-nums`)
All monetary sums (payroll, salary, budgets), dates, employee IDs, durations, and percentage figures must use CSS `font-variant-numeric: tabular-nums` (`tabular-nums` in Tailwind). This ensures numbers align vertically in tables and don't jitter during live updates.

---

## 5. Elevation, Depth & Precision Detailing

Corporate design conveys quality through **hairline precision**, not heavy shadows or floating blur layers.

### 💎 Rules of Elevation
1. **Zero Blurry Gradients:** Gradients dilute brand authority and look like generic landing page templates. Keep card surfaces flat `#FFFFFF` and buttons solid `#2563EB`.
2. **Hairline 1px Borders:** All containers and cards use `border border-[#E2E8F0] dark:border-[#1E293B]`.
3. **Micro-Shadows Only:**
   * Cards & Tables: `shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)]` (Tailwind `shadow-2xs` or `shadow-xs`).
   * Dropdowns & Modals: `shadow-lg border border-[#E2E8F0]` with a dark scrim (`bg-slate-900/40 backdrop-blur-xs`).
4. **Controlled Border Radii:**
   * Badges & Pills: `rounded-full`
   * Buttons & Form Inputs: `rounded-md` (6px) — sharp, crisp, business-like.
   * Dashboard Cards, Modals, Tables: `rounded-lg` (8px–10px).
   * **Do not use** `rounded-3xl` or excessive bubbled corners on functional software.

---

## 6. Structural Component Strategies

### 🏛️ Executive Navigation Bar
* **Surface:** Solid `#FFFFFF` (`dark:bg-[#0F172A]`) with a crisp bottom hairline divider (`border-b border-[#E2E8F0]`).
* **Branding:** High-contrast logo lockup (`logo.png` + `Em<span className="text-[#2563EB]">Nex</span>`).
* **Action CTAs:**
  * Clean text link / ghost button for "Log in".
  * Crisp corporate primary action "Get started" (`bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-md text-sm font-medium px-4 h-9`).

### 🗂️ Command Sidebar (The Strongest Visual Element)
* **Surface:** Deep Navy `#0F172A` — anchors the left edge and establishes institutional permanence.
* **Logo Block:** Icon (`#2563EB`) + White Wordmark (`EmNex`).
* **Active Route Indicator:** Solid `#2563EB` background with pure white text and crisp icon.
* **Inactive Items:** Slate `#CBD5E1` text with `#94A3B8` icon; hover background `#1E293B` with white text.
* **Role Indicator Pill:** Minimalist tag displaying user role (`ADMIN`, `HR_MANAGER`, `EMPLOYEE`) pinned to the user profile dock.

### 📊 Metric & KPI Stat Cards
* **Container:** Pure white `#FFFFFF`, `border border-[#E2E8F0]`, `rounded-lg p-5`.
* **Top Row:** Metric label (`text-sm font-medium text-[#64748B]`) + icon container (`size-9 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center`).
* **Center:** Large metric number (`text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] tabular-nums`).
* **Footer:** Trend indicator (e.g. `+14.2% vs last month` in `#16A34A` or `#64748B`).

### 📑 Financial & Operational Data Tables
* **Container:** Clean rounded card with overflow scroll and sticky headers.
* **Header Row:** Background `#F8FAFC`, uppercase label `text-xs font-semibold text-[#64748B] tracking-wider`.
* **Data Rows:** Background `#FFFFFF`, hover state `hover:bg-[#F8FAFC] transition-colors`.
* **Dividers:** Fine border `#F1F5F9`.
* **Alignment:**
  * Left-align: Names, departments, project titles, status badges.
  * Right-align: Currency amounts, hours, percentages, numerical counts.

### 📈 ApexCharts Corporate Palette
When rendering analytics for executive dashboards:
* **Series 1 (Primary / Volume):** `#2563EB` (Royal Blue)
* **Series 2 (Baseline / Prior Period):** `#0F172A` (Navy) or `#94A3B8` (Slate)
* **Series 3 (Completed / Positive):** `#16A34A` (Green)
* **Series 4 (Pending / Warning):** `#D97706` (Amber)
* **Grid lines:** Subtle `#F1F5F9`, zero unnecessary horizontal/vertical chart noise.

---

## 7. Role-Based Distinction (Corporate Tiering)

EmNex accommodates 3 distinct corporate tiers:

1. **Executive / Admin (`ADMIN`):**
   * High-level visibility across all departments, global cashflow/payroll, employee roster, project assignments.
   * Emphasis on aggregate numbers, audit logs, and action menus.
2. **Operations & Field Manager (`HR_MANAGER`):**
   * Focused on department status, assigning tasks, tracking submissions, and reviewing approvals.
   * Action-oriented UI with fast review dialogs and status toggle controls.
3. **Field Specialist & Employee (`EMPLOYEE`):**
   * Focused personal view: "My Tasks", "Submit Work", "My Payslips".
   * Clean, distraction-free workspace prioritizing completion rate and transparent earnings.

---

## 8. Summary Checklist for Frontend Implementation

- [x] **Primary brand color:** `#2563EB` (matching `public/logo.png`)
- [x] **Primary hover state:** `#1D4ED8`
- [x] **Deep Navy structural surface:** `#0F172A`
- [x] **Clean neutral canvas:** `#F8FAFC`
- [x] **Card / container surfaces:** `#FFFFFF`
- [x] **Hairline borders:** `#E2E8F0`
- [x] **No gradients or glassmorphism** on functional software
- [x] **Monospace / Tabular numbers** for financial data and metrics
- [x] **Compact pill status badges** with soft backgrounds and contrasting text