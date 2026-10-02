const TESTIMONIALS = [
  {
    quote:
      "EmNex replaced three separate tools for dispatch, hours logging, and contractor payroll. Our weekly close cycle dropped from 4 days to under 45 minutes, with zero payroll discrepancy disputes.",
    author: "Marcus Vance",
    role: "VP of Global Field Operations",
    company: "Apex Global Facilities",
  },
  {
    quote:
      "The 43-permission role matrix gave our compliance officer complete peace of mind. Our field supervisors get exactly what they need to approve deliverables without seeing sensitive payroll financials.",
    author: "Elena Rostova",
    role: "Director of People & Operations",
    company: "Vertex Energy Systems",
  },
  {
    quote:
      "Our field teams love the simplicity. They log work proofs on mobile, managers approve in one click, and automated Stripe settlements disburse right on schedule.",
    author: "David Chen",
    role: "Chief Operating Officer",
    company: "TerraCore Infrastructure",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
            Field Validated
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            Proven Across High-Volume Field Operations
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
            Read how enterprise operations leaders streamlined dispatch and payroll with EmNex.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
            >
              <p className="text-xs leading-relaxed text-[#334155] italic dark:text-[#CBD5E1]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">{t.author}</p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{t.role}</p>
                <p className="text-[11px] font-medium text-[#2563EB]">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
