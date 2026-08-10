import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ExpenseForm } from "@/components/expense-form";
import { deleteExpense, getUserCurrency } from "@/app/actions";
import { DeleteButton } from "@/components/delete-button";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/currency";

export default async function ExpensesPage() {
  const { userId } = await auth.protect();
  const currency = await getUserCurrency();

  const expensesRaw = await prisma.expense.findMany({
    where: { userId },
  });

// unpaid first (soonest due date first within that group),
// then paid (most recently paid first within that group)
const expenses = [...expensesRaw].sort((a, b) => {
  if (a.status !== b.status) {
    return a.status === "UNPAID" ? -1 : 1;
  }
  if (a.status === "UNPAID") {
    return a.date.getTime() - b.date.getTime(); // soonest due date first
  }
  return b.date.getTime() - a.date.getTime(); // most recent first
});

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Expenses</h1>

      <ExpenseForm currency={currency} />

      {expenses.length === 0 ? (
        <p className="text-sm text-zinc-400">No expenses logged yet.</p>
      ) : (
        <ul className="space-y-1">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate">{e.category}</span>
                  <StatusBadge id={e.id} status={e.status} />
                </div>
                <div className="text-xs text-muted mt-0.5">
                  {e.date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {e.description && <> — {e.description}</>}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="font-mono text-sm">
                  {formatCurrency(e.amount, currency)}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/dashboard/expenses/${e.id}/edit`}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteExpense.bind(null, e.id)} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}