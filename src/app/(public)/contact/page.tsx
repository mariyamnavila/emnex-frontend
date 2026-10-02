import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact Enterprise Solutions & Support | EmNex",
  description:
    "Get in touch with EmNex solutions engineering, customer support, or security teams. Guaranteed response times and global operations hubs.",
  openGraph: {
    title: "Contact EmNex Enterprise Solutions",
    description:
      "Direct channels for enterprise deployment, technical support, SOC 2 compliance reviews, and partnership inquiries.",
    type: "website",
  },
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Enterprise Solutions & Sales",
    desc: "Inquiries regarding custom deployments, multi-department quotas, and invoice terms.",
    contact: "sales@emnex.com",
    href: "mailto:sales@emnex.com",
  },
  {
    icon: Headphones,
    title: "Technical Support & Escalation",
    desc: "Immediate help for active organizations, Stripe payment troubleshooting, and RBAC issues.",
    contact: "support@emnex.com",
    href: "mailto:support@emnex.com",
  },
  {
    icon: ShieldCheck,
    title: "Security, Privacy & Compliance",
    desc: "SOC 2 Type II audit requests, vendor risk assessments, and vulnerability disclosures.",
    contact: "security@emnex.com",
    href: "mailto:security@emnex.com",
  },
];

const HUBS = [
  { city: "San Francisco, CA", address: "500 Howard Street, Suite 400", timezone: "PST / UTC-8" },
  { city: "London, United Kingdom", address: "30 St Mary Axe, EC3A", timezone: "GMT / UTC+0" },
  { city: "Singapore", address: "1 Marina Boulevard, #28-00", timezone: "SGT / UTC+8" },
];

const SLAS = [
  { priority: "Critical Emergency", responseTime: "< 15 minutes", coverage: "24/7/365 for Enterprise" },
  { priority: "Operations Support", responseTime: "< 2 hours", coverage: "Monday – Saturday" },
  { priority: "General Inquiries", responseTime: "< 24 hours", coverage: "Business days" },
];

export default function ContactPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120]">
      {/* 1. Header */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-[#60A5FA]">
            <Sparkles className="size-3.5" />
            <span>Dedicated Solutions & Operations Desk</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl dark:text-white">
            Connect With Our <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">Enterprise Engineering Team</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base dark:text-[#94A3B8]">
            Whether you are planning an enterprise deployment, assessing SOC 2 compliance, or
            requiring live operational support, our dedicated solutions specialists are ready to assist.
          </p>
        </div>
      </section>

      {/* 2. Form + Operational Details Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          {/* Left Column: Interactive Contact Form (Client Component) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Channels, SLAs & Global Presence */}
          <div className="space-y-6 lg:col-span-5">
            {/* Direct Channels */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#1E293B] dark:bg-[#0F172A]">
              <h3 className="text-xs font-bold tracking-wider text-[#0F172A] uppercase dark:text-white">
                Direct Inbound Channels
              </h3>
              <div className="mt-4 space-y-4">
                {CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <div key={ch.title} className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                        <Icon className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#0F172A] dark:text-white">
                          {ch.title}
                        </p>
                        <p className="text-[11px] leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                          {ch.desc}
                        </p>
                        <a
                          href={ch.href}
                          className="inline-block text-xs font-semibold text-[#2563EB] hover:underline"
                        >
                          {ch.contact}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Response Time Standards */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#1E293B] dark:bg-[#0F172A]">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold tracking-wider text-[#0F172A] uppercase dark:text-white">
                  Response Time Standards
                </h3>
              </div>
              <div className="mt-4 divide-y divide-[#E2E8F0] text-xs dark:divide-[#1E293B]">
                {SLAS.map((sla) => (
                  <div key={sla.priority} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-semibold text-[#0F172A] dark:text-white">{sla.priority}</p>
                      <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">{sla.coverage}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2563EB]">
                      {sla.responseTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Operating Hubs */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#1E293B] dark:bg-[#0F172A]">
              <div className="flex items-center gap-2">
                <Building className="size-4 text-[#2563EB]" />
                <h3 className="text-xs font-bold tracking-wider text-[#0F172A] uppercase dark:text-white">
                  Regional Operating Hubs
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                {HUBS.map((hub) => (
                  <div key={hub.city} className="flex items-start gap-2.5 text-xs">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#64748B]" />
                    <div>
                      <p className="font-semibold text-[#0F172A] dark:text-white">{hub.city}</p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{hub.address}</p>
                      <p className="text-[10px] text-[#2563EB]">{hub.timezone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Demo Sandbox Callout */}
            <div className="rounded-lg border border-[#2563EB]/30 bg-[#EFF6FF] p-6 dark:border-[#1E293B] dark:bg-[#1E293B]">
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                Looking to evaluate without waiting?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#475569] dark:text-[#CBD5E1]">
                Launch our 1-Click Interactive Demo to immediately test Executive Admin,
                Operations Manager, and Field Employee dashboards with pre-seeded data.
              </p>
              <div className="mt-4">
                <Button
                  asChild
                  size="sm"
                  className="h-9 w-full bg-[#2563EB] text-xs font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
                >
                  <Link href="/login" className="inline-flex items-center justify-center gap-2">
                    <span>Launch 1-Click Demo Sandbox</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
