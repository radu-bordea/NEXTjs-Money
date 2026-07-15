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
    className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-zinc-800 py-2"
  >
    <div>
      <span>{i.category}</span>
      <span className="text-zinc-400">
        {' '}
        · {i.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
      {i.description && (
        <span className="text-zinc-400"> — {i.description}</span>
      )}
    </div>
    <div className="flex items-center gap-3">
      <span>{i.amount} kr</span>
      <DeleteButton action={deleteIncome.bind(null, i.id)} />
    </div>
  </li>
))}
        </ul>
      )}
    </div>
  );
}
