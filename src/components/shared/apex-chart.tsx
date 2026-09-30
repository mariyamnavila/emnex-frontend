"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});

type ChartSeries = NonNullable<ApexOptions["series"]>;

interface ApexChartProps {
  series: ChartSeries;
  options: ApexOptions;
  type?:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "donut"
    | "radialBar"
    | "scatter"
    | "bubble"
    | "heatmap"
    | "candlestick"
    | "boxPlot"
    | "radar"
    | "polarArea"
    | "rangeBar"
    | "treemap";
  height?: number;
  className?: string;
}

/**
 * SSR-safe ApexCharts wrapper (client-only) with skeleton while loading.
 * Options should come from baseChartOptions() in lib/chart-theme.ts.
 */
export function ApexChart({
  series,
  options,
  type = "line",
  height = 320,
  className,
}: ApexChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ReactApexChart series={series} options={options} type={type} height={height} />
    </div>
  );
}
