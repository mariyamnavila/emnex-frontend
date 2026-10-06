<div align="center">

# 📄 EmNex Frontend — Complete Page & Route Inventory

**Detailed technical breakdown of all 36 pages and routes implemented in EmNex.**

[![Pages](https://img.shields.io/badge/Total_Routes-36_Routes-2563EB)](#route-index)
[![Role-Based](https://img.shields.io/badge/Workspaces-4_Corporate_Tiers-16A34A)](#role-based-workspaces)
[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)

</div>

---

## 📑 Contents

- [Route Index & Distribution](#route-index--distribution)
- [Public Brand Pages (7 Pages)](#1-public-brand-pages-7-pages)
- [Executive Admin Workspace (9 Pages)](#2-executive-admin-workspace-9-pages)
- [Operations & HR Workspace (4 Pages)](#3-operations--hr-workspace-4-pages)
- [Finance & Payroll Workspace (4 Pages)](#4-finance--payroll-workspace-4-pages)
- [Employee Self-Service Portal (6 Pages)](#5-employee-self-service-portal-6-pages)
- [Payment Integration Routes (2 Pages)](#6-payment-integration-routes-2-pages)
- [System & Error Boundaries (4 Pages)](#7-system--error-boundaries-4-pages)

---

## 📊 Route Index & Distribution

| Workspace Area | Base Path | Target Audience | Primary Focus | Page Count |
| :--- | :--- | :--- | :--- | :---: |
| **Public & Marketing** | `/`, `/about`, `/features`… | Prospective enterprise clients | Product features, pricing calculator, contact desk | **5** |
| **Authentication** | `/login`, `/register` | All corporate tiers | 1-Click demo logins, Google OAuth, tenant onboarding | **2** |
| **Executive Admin** | `/admin/*` | `ADMIN` role | System governance, employee roster, project dispatch, RBAC | **9** |
| **Operations / HR** | `/manager/*` | `HR_MANAGER` role | Kanban task board, deliverable submission review queue | **4** |
| **Finance Management**| `/finance/*` | `FINANCE_MANAGER` role| Payroll batch runs, live calculation preview, Stripe checkout | **4** |
| **Employee Self-Service**| `/dashboard/*` | `EMPLOYEE` & all staff | Personal task backlog, log hours, view verified payslips | **6** |
| **Payment Flow** | `/payment/*` | Stripe redirect callers | Payment success verification & cancellation handling | **2** |
| **System Utility** | Root / Shell | Global exceptions | 404 Not Found, 403 Access Denied, 500 Route Error, Icon | **4** |
| **Total** | | | | **36** |

---

## 1. Public Brand Pages (7 Pages)

### 1.1 Landing / Home Page
- **Route:** `/`
- **Component:** `src/app/(public)/page.tsx`
- **Access:** Public (🔓)
- **Features:** Enterprise hero section with version pill, simulated live command console preview, client logo cloud, 4 architectural engine cards, 3-tier interactive role showcase, verified impact metrics, testimonials, and closing CTA.

### 1.2 Platform Capabilities
- **Route:** `/features`
- **Component:** `src/app/(public)/features/page.tsx`
- **Access:** Public (🔓)
- **Features:** 8 detailed functional modules with technical API payloads and a side-by-side tier comparison matrix (Starter vs Professional vs Enterprise).

### 1.3 Pricing & Plans
- **Route:** `/pricing`
- **Component:** `src/app/(public)/pricing/page.tsx`
- **Access:** Public (🔓)
- **Features:** Interactive `<PricingCalculator />` with monthly/annual billing toggle (20% savings badge), capacity metric cards, detailed feature comparison table, guarantee badges, and billing FAQ.

### 1.4 About & Architecture
- **Route:** `/about`
- **Component:** `src/app/(public)/about/page.tsx`
- **Access:** Public (🔓)
- **Features:** Company mission, four engineering principles, tech stack architecture, chronological milestones (2024–2026), and leadership profiles.

### 1.5 Contact & Solutions Desk
- **Route:** `/contact`
- **Component:** `src/app/(public)/contact/page.tsx`
- **Access:** Public (🔓)
- **Features:** RHF + Zod `<ContactForm />`, guaranteed response SLAs (<15m, <2h, <24h), direct inbound channels, and regional operating hubs (SF, London, Singapore).

### 1.6 Authentication — Login
- **Route:** `/login`
- **Component:** `src/app/(auth)/login/page.tsx`
- **Access:** Public (🔓)
- **Features:** Email & password form, **Four 1-Click Demo Login Buttons** (Admin, HR, Finance, Employee), Google OAuth sign-in button, and redirect protection (`redirectTo`).

### 1.7 Authentication — Organization Registration
- **Route:** `/register`
- **Component:** `src/app/(auth)/register/page.tsx`
- **Access:** Public (🔓)
- **Features:** Organization name, unique workspace slug, admin credentials, real-time password strength meter, and instant onboarding session setup.

---

## 2. Executive Admin Workspace (9 Pages)

All routes require authentication and the `ADMIN` role or corresponding permissions.

| Route | Page Name | Required Permission | Primary UI Capabilities |
| :--- | :--- | :--- | :--- |
| `/admin` | Executive Overview | `analytics.view` | ApexCharts multi-series trends, recent audit stream, KPI cards |
| `/admin/employees` | Employee Directory | `employee.view` | Tabular roster, URL filters (`?search=&status=`), credential resend, termination dialog |
| `/admin/employees/new` | Onboard Employee | `employee.create` | Multi-field onboarding form, department picker, salary type (Monthly vs Hourly) |
| `/admin/departments` | Department Management | `department.view` | Department card grid, headcount badges, create/edit modals, manager assignment |
| `/admin/projects` | Project Portfolio | `project.view` | Project status filters (`ACTIVE`, `COMPLETED`), budget health progress bars, create project modal |
| `/admin/projects/[id]` | Project Detail | `project.view` | Project timeline, budget burn metrics, assignable task table, team roster |
| `/admin/payroll` | Payroll Governance | `payroll.view` | Organization-wide payroll history, approve/reject controls, gross/net audit |
| `/admin/roles` | RBAC Matrix Editor | `role.view` | Custom role builder, 44-permission picker, built-in role "Reset to Defaults" button |
| `/admin/organization` | Organization Settings | `organization.view` | Tenant slug, organization display name, fiscal year settings |
| `/admin/audit-logs` | Security Audit Trail | `audit.view` | Filterable log stream across 34 event types, actor IP, user-agent, delta modal |
| `/admin/profile` | Admin Account Settings | 🔑 Signed In | Personal details, avatar upload to Cloudinary, change password with session revocation |

---

## 3. Operations & HR Workspace (4 Pages)

Tailored for field operations supervisors and HR managers (`HR_MANAGER`).

| Route | Page Name | Required Permission | Primary UI Capabilities |
| :--- | :--- | :--- | :--- |
| `/manager` | Operations Overview | `analytics.view` | Pending submission count, active field tasks, departmental velocity charts |
| `/manager/tasks` | Kanban Task Board | `task.view` | 6-column workflow board (TODO &rarr; IN_PROGRESS &rarr; SUBMITTED &rarr; APPROVED &rarr; COMPLETED &rarr; CANCELLED), priority badges |
| `/manager/submissions` | Deliverable Review Queue | `submission.view` | Review queue filtered by `PENDING`, deliverable proofs, Approve / Reject with written feedback |
| `/manager/profile` | Manager Profile | 🔑 Signed In | Avatar upload, personal contact details, password rotation |

---

## 4. Finance & Payroll Workspace (4 Pages)

Dedicated command center for fiscal managers (`FINANCE_MANAGER`).

| Route | Page Name | Required Permission | Primary UI Capabilities |
| :--- | :--- | :--- | :--- |
| `/finance` | Financial Dashboard | `analytics.view` | Monthly payroll cashflow charts, payment success rate, pending payout queue |
| `/finance/payroll` | Payroll Batch Processing | `payroll.view` | One-click monthly batch generation, live compensation preview (base + extra − deductions), approval sign-off |
| `/finance/payments` | Stripe Settlement Ledger | `payment.view` | Transaction records, payment status badges (`COMPLETED`, `PENDING`, `FAILED`), one-click "Pay with Stripe" button |
| `/finance/profile` | Finance Profile | 🔑 Signed In | Profile info, credentials management |

---

## 5. Employee Self-Service Portal (6 Pages)

Accessible by frontline employees (`EMPLOYEE`) and staff members holding `*_own` permissions.

| Route | Page Name | Required Permission | Primary UI Capabilities |
| :--- | :--- | :--- | :--- |
| `/dashboard` | Specialist Workspace | 🔑 Signed In | Personal assigned tasks overview, pending deliverables count, recent payslip summary |
| `/dashboard/tasks` | My Tasks Pipeline | `task.view_own` | Active tickets assigned to employee, task instructions, status advance button, "Log Hours" shortcut |
| `/dashboard/submissions` | My Submission History | `submission.view_own` | Personal work log, logged hours, reviewer feedback notes, rejection revision flow |
| `/dashboard/payroll` | My Payslips & Earnings | `payroll.view_own` | Monthly payslip table, base salary, bonuses, deductions, net salary breakdown |
| `/dashboard/payments` | My Payment Records | `payment.view_own` | Stripe disbursement history, transaction status, receipt references |
| `/dashboard/profile` | Employee Profile | 🔑 Signed In | Emergency contact, job title, department reference, password change |

---

## 6. Payment Integration Routes (2 Pages)

Handles return loops from hosted Stripe Checkout sessions.

| Route | Page Name | Access | Workflow Description |
| :--- | :--- | :--- | :--- |
| `/payment/success` | Payment Verified | 🔓 / 🔑 | Receives `?session_id=cs_test_...`, calls `GET /api/v1/payments/verify/:sessionId`, displays animated confirmation and link to return to payroll |
| `/payment/cancel` | Payment Cancelled | 🔓 / 🔑 | Informs user that the checkout was cancelled. Retains payroll in `APPROVED` status so it can be retried immediately |

---

## 7. System & Error Boundaries (4 Pages)

| File / Route | Purpose | Behavior |
| :--- | :--- | :--- |
| `src/app/not-found.tsx` (`/_not-found`) | 404 Resource Not Found | Custom illustrated page with navigation fallback |
| `src/app/error.tsx` | Global Application Error | Graceful crash containment with retry button and error digest |
| `src/components/auth/access-denied.tsx` | 403 Forbidden | Renders inside the authenticated app shell when permission check fails |
| `src/app/icon.png` | Dynamic Brand Favicon | Server-generated multi-size favicon matching EmNex vector mark |
