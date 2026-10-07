import type { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Headphones,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PricingCalculator } from "@/components/public/pricing-calculator";
import { PlanCards } from "@/components/public/plan-cards";

export const metadata: Metadata = {
  title: "Pricing & Corporate Plans | EmNex Enterprise",
  description:
    "Predictable enterprise pricing for workforce management, field dispatch, and automated Stripe payroll. Start free, scale as your operations expand.",
  openGraph: {
    title: "EmNex Pricing & Corporate Plans",
    description:
      "Transparent workforce SaaS pricing. Starter free tier, Professional for operations teams, and Enterprise with 43-permission custom roles.",
    type: "website",
  },
};

const FEATURE_CATEGORIES = [
  {
    category: "Workforce & Organization Hierarchy",
    rows: [
      { name: "Active employee headcount", starter: "10 workers", pro: "100 workers", enterprise: "Unlimited" },
      { name: "Department hierarchies", starter: "1 department", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Lifecycle states (Active, Probation, etc.)", starter: "Included", pro: "Included", enterprise: "Included" },
      { name: "Temporary credential generation", starter: "Included", pro: "Included", enterprise: "Included" },
    ],
  },
  {
    category: "Projects, Tasks & Submissions",
    rows: [
      { name: "Active project pipelines", starter: "Up to 5", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Task prioritization (Low, Med, High, Urgent)", starter: "Included", pro: "Included", enterprise: "Included" },
      { name: "Deliverable submissions & work proofs", starter: "Basic", pro: "Included with reviews", enterprise: "Multi-stage verification" },
      { name: "Manager review & approval queues", starter: "Manual", pro: "Included", enterprise: "Included + SLA routing" },
    ],
  },
  {
    category: "Automated Payroll & Stripe Settlements",
    rows: [
      { name: "Algorithmic payroll generation", starter: "Not available", pro: "Monthly batch runs", enterprise: "Scheduled + Real-time runs" },
      { name: "Gross, deductions & net salary calculation", starter: "Not available", pro: "Included", enterprise: "Included + Custom rules" },
      { name: "Stripe Checkout payment processing", starter: "Manual", pro: "Test & Live Stripe", enterprise: "Stripe + Net-30 Invoicing" },
      { name: "Self-service employee payslips", starter: "Not available", pro: "Included", enterprise: "Included + Custom Branding" },
    ],
  },
  {
    category: "Security, RBAC & Governance",
    rows: [
      { name: "Role-based access tiers", starter: "3 standard roles", pro: "4 standard roles", enterprise: "Custom 43-permission builder" },
      { name: "Immutable audit log retention", starter: "7 days", pro: "90 days", enterprise: "Unlimited exportable" },
      { name: "Next.js middleware route protection", starter: "Included", pro: "Included", enterprise: "Included" },
      { name: "Single Sign-On (SSO / SAML)", starter: "Not available", pro: "Available add-on", enterprise: "Included" },
    ],
  },
  {
    category: "Support & Infrastructure SLAs",
    rows: [
      { name: "System availability guarantee", starter: "Best effort", pro: "99.9% uptime", enterprise: "99.99% contract SLA" },
      { name: "Support response time", starter: "Community docs", pro: "< 4 hours priority", enterprise: "24/7 dedicated engineer" },
      { name: "Data backup frequency", starter: "Weekly", pro: "Daily automated", enterprise: "Continuous real-time" },
    ],
  },
];

const PRICING_FAQS = [
  {
    q: "Can I try EmNex before purchasing a subscription?",
    a: "Yes. The Starter tier is 100% free with no credit card required for up to 10 employees. For larger teams, our Professional plan includes a 14-day free trial. You can also test all features immediately using our 1-Click Demo accounts on the login page.",
  },
  {
    q: "How does billing scaling work as my field workforce fluctuates?",
    a: "You are billed strictly based on your active employee count at the start of each monthly billing cycle. Inactive or terminated employee records are archived and do not count against your tier limit.",
  },
  {
    q: "How does the Stripe payment integration work?",
    a: "EmNex connects with Stripe via secure hosted checkout sessions. When payroll is generated and approved, payout requests generate Stripe Checkout sessions where transactions can be finalized using credit/debit cards or direct ACH. In development and testing, Stripe test cards allow instant verification.",
  },
  {
    q: "Can we migrate existing data from spreadsheets or legacy software?",
    a: "Yes. Our engineering team provides data import tooling for departments, employee rosters, and historical task records for Professional and Enterprise accounts.",
  },
  {
    q: "What security measures protect our organization's payroll data?",
    a: "All database communication is secured with TLS 1.3 encryption, and data at rest is encrypted via AES-256. EmNex enforces granular permissions so that only users with explicit financial rights (Admin or Finance Manager) can view compensation totals.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120]">
      {/* 1. Header */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-[#60A5FA]">
            <Sparkles className="size-3.5" />
            <span>Transparent Corporate Pricing</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl dark:text-white">
            Predictable Pricing for <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">High-Performance Field Operations</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base dark:text-[#94A3B8]">
            Choose the plan that fits your organization. From early-stage field teams to enterprise
            networks managing complex multi-tier workforce dispatch and payroll.
          </p>
        </div>
      </section>

      {/* 2. Interactive Calculator / Plans */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <PricingCalculator />
        </div>

        {/* Guarantees Ribbon */}
        <div className="mx-auto mt-14 max-w-5xl rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                <RotateCcw className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">14-Day Free Trial</p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">No credit card required</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                <ShieldCheck className="size-4 text-[#16A34A]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">99.99% Uptime SLA</p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Guaranteed operational uptime</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                <Lock className="size-4 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">Stripe Verified</p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">PCI-DSS Level 1 payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                <Headphones className="size-4 text-[#D97706]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">Dedicated Support</p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Rapid solutions desk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deep Feature Comparison Table */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Deep Specification
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Complete Feature Comparison
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Detailed breakdown of functionality, quotas, and governance across all tiers.
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {FEATURE_CATEGORIES.map((category) => (
              <div
                key={category.category}
                className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0B1120]"
              >
                <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3 dark:border-[#1E293B] dark:bg-[#0F172A]">
                  <h3 className="text-xs font-bold tracking-wider text-[#0F172A] uppercase dark:text-white">
                    {category.category}
                  </h3>
                </div>
                <PlanCards
                  className="sm:hidden"
                  rows={category.rows.map((row) => ({ label: row.name, starter: row.starter, pro: row.pro, enterprise: row.enterprise }))}
                />
                <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-xl text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[11px] font-semibold tracking-wider text-[#64748B] uppercase dark:border-[#1E293B] dark:text-[#94A3B8]">
                      <th scope="col" className="px-5 py-2.5 font-semibold">Feature</th>
                      <th scope="col" className="px-5 py-2.5 font-semibold">Starter</th>
                      <th scope="col" className="px-5 py-2.5 font-semibold text-[#2563EB]">Professional</th>
                      <th scope="col" className="px-5 py-2.5 font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                    {category.rows.map((row) => (
                      <tr key={row.name} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/40">
                        <td className="w-1/2 px-5 py-3.5 font-medium text-[#0F172A] dark:text-white">
                          {row.name}
                        </td>
                        <td className="w-1/6 px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8]">
                          {row.starter}
                        </td>
                        <td className="w-1/6 px-5 py-3.5 font-semibold text-[#2563EB]">
                          {row.pro}
                        </td>
                        <td className="w-1/6 px-5 py-3.5 text-[#0F172A] dark:text-white">
                          {row.enterprise}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section
        id="faq"
        className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Billing Clarifications
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Pricing & Billing FAQ
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Common questions regarding plans, payments, and account scaling.
            </p>
          </div>

          <div className="mt-10 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
            <Accordion type="single" collapsible className="w-full">
              {PRICING_FAQS.map((item, i) => (
                <AccordionItem key={i} value={`pricing-faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] dark:text-white dark:hover:text-[#60A5FA]">
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="size-4 shrink-0 text-[#2563EB]" />
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center sm:flex-row sm:text-left dark:border-[#1E293B] dark:bg-[#0B1120]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Need custom enterprise terms or invoice billing?
            </h3>
            <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
              Speak directly with our enterprise solutions desk for custom contracts, SLAs, and data migration.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              asChild
              className="h-10 bg-[#2563EB] px-5 text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              <Link href="/contact" className="inline-flex items-center gap-2">
                <span>Talk to Solutions Team</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
