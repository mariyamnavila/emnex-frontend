import type { ApexOptions } from "apexcharts";

/** EmNex chart palette — aligned with --chart-1..5 in globals.css */
export const EMNEX_CHART_COLORS = [
  "#2563EB", // primary blue
  "#0F172A", // deep navy
  "#16A34A", // success
  "#D97706", // warning
  "#64748B", // muted
] as const;

// Same meaning as StatusBadge tones, so a status has one color everywhere
export const STATUS_CHART_COLORS: Record<string, string> = {
  ACTIVE: "#2563EB",
  PLANNED: "#94A3B8",
  ON_HOLD: "#D97706",
  COMPLETED: "#16A34A",
  CANCELLED: "#DC2626",
  DRAFT: "#94A3B8",
  GENERATED: "#D97706",
  APPROVED: "#2563EB",
  PROCESSING: "#60A5FA",
  PAID: "#16A34A",
  REJECTED: "#DC2626",
};

export const chartAxisLabelStyle = { colors: "#64748B", fontSize: "12px" };

/**
 * Default ApexCharts options themed with EmNex design tokens.
 * Pages can spread this and override individual keys.
 */
export function baseChartOptions(overrides?: ApexOptions): ApexOptions {
  return {
    chart: {
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true, speed: 300 },
    },
    colors: [...EMNEX_CHART_COLORS],
    dataLabels: { enabled: false },
    grid: { borderColor: "#E2E8F0", strokeDashArray: 4 },
    legend: {
      labels: { colors: "#64748B" },
      markers: { size: 4 },
    },
    stroke: { curve: "smooth", width: 2 },
    tooltip: { theme: "light" },
    xaxis: {
      labels: { style: { colors: ["#64748B"] } },
      axisBorder: { color: "#E2E8F0" },
      axisTicks: { color: "#E2E8F0" },
    },
    yaxis: {
      labels: { style: { colors: ["#64748B"] } },
    },
    ...overrides,
  };
}
