import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { IncomeForm } from "@/components/income-form";
import { deleteIncome, getUserCurrency } from "@/app/actions";
import { DeleteButton } from "@/components/delete-button";
import { MonthFilter } from "@/components/month-filter";
import { formatCurrency } from "@/lib/currency";

function currentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function monthRangeFor(value: string) {
  const [year, month] = value.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
}

export default async function IncomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { userId } = await auth.protect();
  const currency = await getUserCurrency();
  const { filter } = await searchParams;

  const activeFilter = filter ?? currentMonthValue();
  const isAll = activeFilter === "all";

  const incomes = await prisma.income.findMany({
    where: isAll
      ? { userId }
      : {
          userId,
          date: {
            gte: monthRangeFor(activeFilter).start,
            lt: monthRangeFor(activeFilter).end,
          },
        },
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">Income</h1>
        <MonthFilter basePath="/dashboard/income" current={activeFilter} />
      </div>

      <IncomeForm currency={currency} />

      {incomes.length === 0 ? (
        <p className="text-sm text-zinc-400">
          {isAll ? "No income logged yet." : "Nothing logged for this period."}
        </p>
      ) : (
        <ul className="space-y-1">
          {incomes.map((i) => (
            <li
              key={i.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border py-3"
            >
              <div className="min-w-0">
                <span className="font-medium truncate">{i.category}</span>
                <div className="text-xs text-muted mt-0.5">
                  {i.date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {i.description && <> — {i.description}</>}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="font-mono text-sm">
                  {formatCurrency(i.amount, currency)}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/dashboard/income/${i.id}/edit`}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteIncome.bind(null, i.id)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}