"use client"

import * as React from "react"
import { cn } from "cn"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-white p-3 [--cell-radius:0.5rem] [--cell-size:--spacing(9)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent dark:bg-[#0F172A]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 rounded-lg border-[#E2E8F0] bg-white p-0 text-[#64748B] select-none hover:bg-[#EFF6FF] hover:text-[#2563EB] aria-disabled:opacity-40 dark:border-[#1E293B] dark:bg-[#0B1120] dark:hover:bg-[#1E293B] dark:hover:text-[#60A5FA]",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-8 rounded-lg border-[#E2E8F0] bg-white p-0 text-[#64748B] select-none hover:bg-[#EFF6FF] hover:text-[#2563EB] aria-disabled:opacity-40 dark:border-[#1E293B] dark:bg-[#0B1120] dark:hover:bg-[#1E293B] dark:hover:text-[#60A5FA]",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center px-10",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-8 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius) border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#1E293B]",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-white opacity-0 dark:bg-[#0F172A]",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-semibold text-[#0F172A] select-none dark:text-white",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) px-2 py-1 text-sm [&>svg]:size-3.5 [&>svg]:text-[#64748B]",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 text-[0.7rem] font-semibold tracking-wide text-[#94A3B8] uppercase select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-1.5 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-[#94A3B8] select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-[#EFF6FF] after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-[#EFF6FF] dark:bg-[#1E293B] dark:after:bg-[#1E293B]",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-[#EFF6FF] after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-[#EFF6FF] dark:bg-[#1E293B] dark:after:bg-[#1E293B]",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-[#EFF6FF] font-semibold text-[#2563EB] ring-1 ring-[#2563EB]/30 data-[selected=true]:ring-0 dark:bg-[#1E293B] dark:text-[#60A5FA]",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[#CBD5E1] aria-selected:text-[#CBD5E1] dark:text-[#475569]",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-[#CBD5E1] opacity-40 dark:text-[#475569]",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 text-sm leading-none font-normal text-[#334155] hover:bg-[#EFF6FF] hover:text-[#2563EB] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B] dark:hover:text-[#60A5FA] group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-[#2563EB]/50 data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[#EFF6FF] data-[range-middle=true]:text-[#2563EB] dark:data-[range-middle=true]:bg-[#1E293B] data-[range-start=true]:rounded-l-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-start=true]:bg-[#2563EB] data-[range-end=true]:bg-[#2563EB] data-[range-start=true]:text-white data-[range-end=true]:text-white data-[selected-single=true]:bg-[#2563EB] data-[selected-single=true]:font-semibold data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-[#1D4ED8] data-[selected-single=true]:hover:text-white [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
