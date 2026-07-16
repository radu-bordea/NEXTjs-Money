import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ExpenseForm } from "@/components/expense-form";
import { deleteExpense } from "@/app/actions";
import { DeleteButton } from "@/components/delete-button";

import { StatusBadge } from "@/components/status-badge";

export default async function ExpensesPage() {
  const { userId } = await auth.protect();

  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Expenses</h1>

      <ExpenseForm />

      {expenses.length === 0 ? (
        <p className="text-sm text-zinc-400">No expenses logged yet.</p>
      ) : (
        <ul className="space-y-1">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-zinc-800 py-2"
            >
              <div>
                <span>{e.category}</span>
                <span className="text-zinc-400">
                  {" "}
                  ·{" "}
                  {e.date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {e.description && (
                  <span className="text-zinc-400"> — {e.description}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span>{e.amount} kr</span>
                <Link
                  href={`/dashboard/expenses/${e.id}/edit`}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteExpense.bind(null, e.id)} />
                <div className="flex items-center gap-3">
                  <StatusBadge id={e.id} status={e.status} />
                  <span>{e.amount} kr</span>
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
