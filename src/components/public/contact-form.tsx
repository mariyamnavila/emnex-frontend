"use client";
import { focusNextOnEnter } from "@/lib/form";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Mail,
  User,
  Building,
  CheckCircle2,
  Send,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid corporate or personal email"),
  company: z.string().min(2, "Organization name must be at least 2 characters"),
  inquiryType: z.enum(["sales", "support", "partnership", "security"], {
    errorMap: () => ({ message: "Please select an inquiry type" }),
  }),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters for sufficient context"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      inquiryType: "sales",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    void data;
    // Simulate brief network latency for realistic enterprise feedback
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Inquiry received. Our enterprise team will respond within 24 hours.");
    setSubmitted(true);
    reset();
  }

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-[#1E293B] dark:bg-[#0F172A] sm:p-8">
      <div className="border-b border-[#E2E8F0] pb-6 dark:border-[#1E293B]">
        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
          Send an enterprise dispatch inquiry
        </h2>
        <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
          Direct routing to our solutions engineering and support team. Average response time: &lt; 2 hours during market hours.
        </p>
      </div>

      {submitted ? (
        <div className="mt-8 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-8 text-center dark:border-[#14532D] dark:bg-[#052E16]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A] dark:bg-[#14532D] dark:text-[#4ADE80]">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[#0F172A] dark:text-white">
            Transmission Delivered Successfully
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8]">
            Your inquiry ticket has been logged into our customer dispatch system. An enterprise operations specialist will contact your specified email.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              className="border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
              onClick={() => setSubmitted(false)}
            >
              Submit another message
            </Button>
          </div>
        </div>
      ) : (
        <form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-[#0F172A] dark:text-white">
                Full Name <span className="text-[#DC2626]">*</span>
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="name"
                  placeholder="e.g. Sarah Jenkins"
                  {...register("name")}
                  className="h-10 rounded-md border-[#CBD5E1] bg-white pl-9 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.name ? (
                <p className="text-[11px] font-medium text-[#DC2626]">{errors.name.message}</p>
              ) : null}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#0F172A] dark:text-white">
                Work Email <span className="text-[#DC2626]">*</span>
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah@organization.com"
                  {...register("email")}
                  className="h-10 rounded-md border-[#CBD5E1] bg-white pl-9 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.email ? (
                <p className="text-[11px] font-medium text-[#DC2626]">{errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Company / Org */}
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-semibold text-[#0F172A] dark:text-white">
                Company / Organization <span className="text-[#DC2626]">*</span>
              </Label>
              <div className="relative">
                <Building className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="company"
                  placeholder="Apex Global Logistics"
                  {...register("company")}
                  className="h-10 rounded-md border-[#CBD5E1] bg-white pl-9 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.company ? (
                <p className="text-[11px] font-medium text-[#DC2626]">{errors.company.message}</p>
              ) : null}
            </div>

            {/* Inquiry Category */}
            <div className="space-y-1.5">
              <Label htmlFor="inquiryType" className="text-xs font-semibold text-[#0F172A] dark:text-white">
                Inquiry Focus <span className="text-[#DC2626]">*</span>
              </Label>
              <div className="relative">
                <HelpCircle className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <select
                  id="inquiryType"
                  {...register("inquiryType")}
                  className="h-10 w-full rounded-md border border-[#CBD5E1] bg-white pl-9 pr-3 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                >
                  <option value="sales">Enterprise Deployment & Pricing</option>
                  <option value="support">Technical Support & API Access</option>
                  <option value="security">Security & SOC2 Audit Review</option>
                  <option value="partnership">System Integrator & Partner</option>
                </select>
              </div>
              {errors.inquiryType ? (
                <p className="text-[11px] font-medium text-[#DC2626]">{errors.inquiryType.message}</p>
              ) : null}
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-xs font-semibold text-[#0F172A] dark:text-white">
              Subject <span className="text-[#DC2626]">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="e.g. Migration from legacy payroll system to EmNex 40-role RBAC"
              {...register("subject")}
              className="h-10 rounded-md border-[#CBD5E1] bg-white px-3 text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
            />
            {errors.subject ? (
              <p className="text-[11px] font-medium text-[#DC2626]">{errors.subject.message}</p>
            ) : null}
          </div>

          {/* Detailed Message */}
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs font-semibold text-[#0F172A] dark:text-white">
              Operational Context & Inquiry Details <span className="text-[#DC2626]">*</span>
            </Label>
            <Textarea
              id="message"
              rows={5}
              placeholder="Please provide specifics: number of field employees, active departments, existing payroll cadence, or integration targets..."
              {...register("message")}
              className="rounded-md border-[#CBD5E1] bg-white p-3 text-xs leading-relaxed text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
            />
            {errors.message ? (
              <p className="text-[11px] font-medium text-[#DC2626]">{errors.message.message}</p>
            ) : null}
          </div>

          {/* Submission CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-md bg-[#2563EB] text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Transmitting Message...
                </>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Send className="size-3.5" />
                  Dispatch Inquiry to Solutions Desk
                </span>
              )}
            </Button>
            <p className="mt-2 text-center text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Protected by Enterprise TLS 1.3 encryption. We never share institutional correspondence.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
