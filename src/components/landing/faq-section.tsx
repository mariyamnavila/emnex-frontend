import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How does EmNex handle 3 distinct corporate roles?",
    a: "EmNex enforces role-based access control at both Next.js middleware and backend API layers. Executive Admins govern global org analytics, payroll approvals, and RBAC matrices; Operations Managers oversee department tasks, dispatching, and submission approvals; while Field Employees access their personalized task queues, submission history, and verified payslips.",
  },
  {
    q: "Can I test the platform without setting up real bank accounts?",
    a: "Yes. EmNex features 1-Click Demo Login buttons for all roles directly on the login page. Furthermore, our Stripe integration runs in Test Mode, enabling you to test full payment sessions and webhook updates safely.",
  },
  {
    q: "How is payroll calculated and disbursed?",
    a: "Admins or Finance managers trigger payroll generation for specified date ranges. The system aggregates active base salaries and calculates deductions to yield exact net compensation. Once approved by an authorized executive, Stripe checkout sessions can be generated for instant digital settlement.",
  },
  {
    q: "Can we create custom roles with tailored permissions?",
    a: "Yes. EmNex includes an organization role builder that allows you to configure custom roles from our 43 discrete permissions (e.g. 'Field Supervisor', 'Regional Auditor', 'Contractor Lead') matching your corporate hierarchy.",
  },
  {
    q: "How does the work submission workflow function?",
    a: "Field employees submit completion notes and proofs against assigned tasks. Assigned managers receive the item in their Review Queue, where they can approve the task or reject it with actionable feedback.",
  },
];

export function FaqSection() {
  return (
    <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
            Operational Answers
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
            Key architectural details about EmNex deployment, roles, and payroll flows.
          </p>
        </div>

        <div className="mt-10 rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] dark:text-white dark:hover:text-[#60A5FA]">
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="size-4 shrink-0 text-[#2563EB]" />
                    {faq.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
