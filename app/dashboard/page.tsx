import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { IncomeExpensePie } from "@/components/income-expense-pie";
import { ExpensesByCategoryBar } from "@/components/expenses-by-category-bar";
import { IncomeExpenseTrend } from "@/components/income-expense-trend";
import Link from "next/link";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { UnpaidBillsPanel } from "@/components/unpaid-bills-panel";

function parseMonthParam(month?: string) {
  if (month) {
    const [year, m] = month.split("-").map(Number);
    if (year && m) return new Date(year, m - 1, 1);
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function monthRangeFor(reference: Date) {
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 1);
  return { start, end };
}

function toMonthParam(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatNOK(amount: number) {
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// always trails from "today", independent of which month you're browsing above —
// this is a separate long-term view, not tied to month navigation
function last6MonthsRange() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const months: Date[] = [];
  for (let i = 0; i < 6; i++) {
    months.push(new Date(start.getFullYear(), start.getMonth() + i, 1));
  }
  return { start, end, months };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { userId } = await auth.protect();
  const { month } = await searchParams;

  const reference = parseMonthParam(month);
  const { start, end } = monthRangeFor(reference);

  const prevMonth = new Date(
    reference.getFullYear(),
    reference.getMonth() - 1,
    1,
  );
  const nextMonth = new Date(
    reference.getFullYear(),
    reference.getMonth() + 1,
    1,
  );

  const now = new Date();
  const isCurrentMonth =
    reference.getFullYear() === now.getFullYear() &&
    reference.getMonth() === now.getMonth();

  const trendRange = last6MonthsRange();

  const [monthIncome, monthExpenses, trendIncome, trendExpenses] =
    await Promise.all([
      prisma.income.findMany({
        where: { userId, date: { gte: start, lt: end } },
        orderBy: { date: "desc" },
      }),
      prisma.expense.findMany({
        where: { userId, date: { gte: start, lt: end } },
        orderBy: { date: "desc" },
      }),
      prisma.income.findMany({
        where: { userId, date: { gte: trendRange.start, lt: trendRange.end } },
        select: { amount: true, date: true },
      }),
      prisma.expense.findMany({
        where: { userId, date: { gte: trendRange.start, lt: trendRange.end } },
        select: { amount: true, date: true },
      }),
    ]);

  const totalIncome = monthIncome.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = monthExpenses.reduce((sum, r) => sum + r.amount, 0);
  const net = totalIncome - totalExpenses;

  const unpaidExpenses = monthExpenses.filter((e) => e.status === "UNPAID");
  const unpaidTotal = unpaidExpenses.reduce((sum, e) => sum + e.amount, 0);

  // group this month's expenses by category, largest first
  const categoryTotals = new Map<string, number>();
  for (const e of monthExpenses) {
    categoryTotals.set(
      e.category,
      (categoryTotals.get(e.category) || 0) + e.amount,
    );
  }
  const categoryData = Array.from(categoryTotals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  // bucket trend data into the 6 month slots
  const trendData = trendRange.months.map((monthDate) => {
    const label = monthDate.toLocaleDateString("en-GB", { month: "short" });
    const income = trendIncome
      .filter(
        (r) =>
          r.date.getFullYear() === monthDate.getFullYear() &&
          r.date.getMonth() === monthDate.getMonth(),
      )
      .reduce((sum, r) => sum + r.amount, 0);
    const expense = trendExpenses
      .filter(
        (r) =>
          r.date.getFullYear() === monthDate.getFullYear() &&
          r.date.getMonth() === monthDate.getMonth(),
      )
      .reduce((sum, r) => sum + r.amount, 0);
    return { month: label, income, expense };
  });

  const monthLabel = reference.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const recent = [
    ...monthIncome.map((r) => ({ ...r, kind: "income" as const })),
    ...monthExpenses.map((r) => ({ ...r, kind: "expense" as const })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard?month=${toMonthParam(prevMonth)}`}
            className="rounded-md p-1.5 text-muted hover:text-foreground hover:bg-surface-2"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </Link>
          <span className="text-sm text-muted w-32 text-center">
            {monthLabel}
          </span>
          {isCurrentMonth ? (
            <span className="rounded-md p-1.5 text-muted/30">
              <ChevronRight size={18} />
            </span>
          ) : (
            <Link
              href={`/dashboard?month=${toMonthParam(nextMonth)}`}
              className="rounded-md p-1.5 text-muted hover:text-foreground hover:bg-surface-2"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </Link>
          )}
        </div>
      </div>
      <p className="text-xs text-muted mb-6">
        {isCurrentMonth
          ? "Showing the current month."
          : "Showing a past month — not the current one."}
      </p>

      {/* summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-muted mb-1">Income</div>
          <div className="text-lg font-semibold text-income">
            +{formatNOK(totalIncome)} kr
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-muted mb-1">Expenses</div>
          <div className="text-lg font-semibold text-expense">
            -{formatNOK(totalExpenses)} kr
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs text-muted mb-1">Net</div>
          <div
            className={`text-lg font-semibold ${net >= 0 ? "text-income" : "text-expense"}`}
          >
            {net >= 0 ? "+" : ""}
            {formatNOK(net)} kr
          </div>
        </div>
      </div>

      {/* unpaid bills */}
      {unpaidExpenses.length > 0 && (
        <UnpaidBillsPanel expenses={unpaidExpenses} total={unpaidTotal} />
      )}

      {/* pie + recent activity */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-muted mb-2">
            Income vs. Expenses
          </h2>
          <IncomeExpensePie
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-muted mb-3">
            Recent activity
          </h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted">
              Nothing logged for {monthLabel}.
            </p>
          ) : (
            <ul className="space-y-1">
              {recent.map((r) => (
                <li
                  key={`${r.kind}-${r.id}`}
                  className="flex justify-between text-sm border-b border-border py-2 last:border-0"
                >
                  <span className="truncate">{r.category}</span>
                  <span
                    className={
                      r.kind === "income" ? "text-income" : "text-expense"
                    }
                  >
                    {r.kind === "income" ? "+" : "-"}
                    {formatNOK(r.amount)} kr
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* category breakdown */}
      <div className="rounded-xl border border-border bg-surface p-4 mb-4">
        <h2 className="text-sm font-medium text-muted mb-2">
          Expenses by category — {monthLabel}
        </h2>
        <ExpensesByCategoryBar data={categoryData} />
      </div>

      {/* 6-month trend */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-sm font-medium text-muted mb-2">Last 6 months</h2>
        <IncomeExpenseTrend data={trendData} />
      </div>
    </div>
  );
}
