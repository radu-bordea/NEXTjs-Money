import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { IncomeForm } from "@/components/income-form";
import { deleteIncome } from "@/app/actions";
import { DeleteButton } from "@/components/delete-button";

export default async function IncomePage() {
  const { userId } = await auth.protect();

  const incomes = await prisma.income.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Income</h1>

      <IncomeForm />

      {incomes.length === 0 ? (
        <p className="text-sm text-zinc-400">No income logged yet.</p>
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
                <span className="font-mono text-sm">{i.amount} kr</span>
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