"use client";

import { useRouter } from "next/navigation";

function monthOptions(monthsBack: number, monthsForward: number) {
  const now = new Date();
  const options: { value: string; label: string }[] = [];

  // furthest future month first, walking down to furthest past month,
  // so the dropdown reads chronologically top-to-bottom
  for (let i = monthsForward; i >= -monthsBack; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
    options.push({ value, label });
  }
  return options;
}

export function MonthFilter({
  basePath,
  current,
}: {
  basePath: string;
  current: string; // "all" or "YYYY-MM"
}) {
  const router = useRouter();
  const options = monthOptions(12, 3); // 12 months back, 3 months ahead

  return (
    <select
      value={current}
      onChange={(e) => {
        const value = e.target.value;
        router.push(
          value === "all"
            ? `${basePath}?filter=all`
            : `${basePath}?filter=${value}`,
        );
      }}
      className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
    >
      <option value="all">All time</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}