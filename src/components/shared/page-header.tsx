import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 @2xl:flex-row @2xl:items-center @2xl:justify-between dark:border-[#1E293B]",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}
