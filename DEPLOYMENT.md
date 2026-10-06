<div align="center">

# 🚀 EmNex Frontend — Production Deployment Guide

**Step-by-step instructions for deploying EmNex on Vercel with zero CORS friction, same-origin reverse proxies, and production Stripe integration.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.7-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)

</div>

---

## 📑 Contents

- [Deployment Architecture](#deployment-architecture)
- [Vercel 1-Click Setup](#vercel-1-click-setup)
- [Environment Variables Checklist](#environment-variables-checklist)
- [Reverse Proxy & Cookie Configuration](#reverse-proxy--cookie-configuration)
- [Stripe Production Redirects](#stripe-production-redirects)
- [Post-Deployment Verification Matrix](#post-deployment-verification-matrix)

---

## 🏗️ Deployment Architecture

In production, EmNex uses a **Same-Origin Reverse Proxy** configuration. The client browser communicates strictly with the frontend domain, while Next.js server rewrites transparently forward API calls to the backend:

```text
┌─────────────────────────┐
│     Client Browser      │
└────────────┬────────────┘
             │ All requests to /api/v1/*
             ▼
┌──────────────────────────────────────────────┐
│ Next.js App on Vercel                        │
│ https://emnex-frontend.vercel.app            │
│ (proxy.ts verifies httpOnly JWT cookies)     │
└────────────┬─────────────────────────────────┘
             │ Internal Edge Rewrite (next.config.ts)
             ▼
┌──────────────────────────────────────────────┐
│ Express API on Vercel                        │
│ https://emnex-api.vercel.app/api/v1/*        │
└──────────────────────────────────────────────┘
```

---

## ⚙️ Environment Variables Checklist

Set these variables in the **Vercel Project Settings &rarr; Environment Variables**:

| Variable | Environment | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `BACKEND_URL` | Production | `https://emnex-api.vercel.app` | Target origin of the Express API backend |
| `JWT_ACCESS_SECRET` | Production | `super_secret_jwt_key_...` | **Must exactly match the backend's `JWT_ACCESS_SECRET`** |
| `NEXT_PUBLIC_DEMO_ADMIN_EMAIL` | Production | `admin@emnex.com` | Pre-fills the 1-Click Demo Admin button |
| `NEXT_PUBLIC_DEMO_ADMIN_PASSWORD` | Production | `EmnexAdmin123!` | Password for 1-Click Demo Admin |
| `NEXT_PUBLIC_DEMO_MANAGER_EMAIL` | Production | `manager@emnex.com` | Pre-fills the 1-Click Demo HR Manager button |
| `NEXT_PUBLIC_DEMO_MANAGER_PASSWORD` | Production | `EmnexManager123!` | Password for 1-Click Demo HR Manager |
| `NEXT_PUBLIC_DEMO_FINANCE_EMAIL` | Production | `finance@emnex.com` | Pre-fills the 1-Click Demo Finance button |
| `NEXT_PUBLIC_DEMO_FINANCE_PASSWORD` | Production | `EmnexFinance123!` | Password for 1-Click Demo Finance |
| `NEXT_PUBLIC_DEMO_EMPLOYEE_EMAIL` | Production | `employee@emnex.com` | Pre-fills the 1-Click Demo Employee button |
| `NEXT_PUBLIC_DEMO_EMPLOYEE_PASSWORD` | Production | `EmnexEmployee123!` | Password for 1-Click Demo Employee |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Production | `123456...apps.googleusercontent.com` | (Optional) Enables Google OAuth button |

---

## 🔄 Reverse Proxy & Cookie Configuration

Because `next.config.ts` rewrites `/api/v1/:path*` to `BACKEND_URL/api/v1/:path*`:
1. **No Third-Party Cookie Blocking**: Safari, Chrome, and Firefox treat the `accessToken` and `refreshToken` cookies as first-party cookies.
2. **Edge Middleware Reads Cookies**: `src/proxy.ts` can immediately inspect the cookie on initial page load, enabling fast redirects without client hydration flashes.
3. **No CORS Headers Needed**: Browser calls are strictly same-origin.

---

## 💳 Stripe Production Redirects

Ensure the **Backend** environment variables are configured to point back to the deployed frontend:

- On Backend: `APP_URL=https://emnex-frontend.vercel.app`
- On Backend: `FRONTEND_URL=https://emnex-frontend.vercel.app`

When an approved payroll is paid, the backend tells Stripe to redirect payers to:
- `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
- `${APP_URL}/payment/cancel`

---

## ✅ Post-Deployment Verification Matrix

Run through this 5-point verification checklist on your deployed production URL:

1. [ ] **Public Landing**: Open `https://your-domain.vercel.app`. Verify that images, pricing calculator, and role cards render smoothly.
2. [ ] **1-Click Admin Demo**: Click "Login as Admin" &rarr; verify immediate redirect to `/admin` dashboard.
3. [ ] **1-Click Employee Demo**: Open `/login` in incognito &rarr; click "Login as Employee" &rarr; verify `/dashboard` displays tasks and payslips.
4. [ ] **Kanban Drag/Filter**: Open `/manager/tasks` &rarr; verify status filters reflect in the URL query string.
5. [ ] **Stripe Test Checkout**: Open `/finance/payroll` &rarr; click "Pay" on an approved payroll &rarr; complete with test card `4242...` &rarr; verify automated return to `/payment/success`.
