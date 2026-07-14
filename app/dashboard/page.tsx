import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export default async function DashboardPage() {
  const { userId } = await auth.protect()

  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    }),
  ])

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-zinc-500 mb-2">Income</h2>
        {incomes.length === 0 ? (
          <p className="text-sm text-zinc-400">No income logged yet.</p>
        ) : (
          <ul className="space-y-1">
            {incomes.map((i) => (
              <li key={i.id} className="flex justify-between text-sm border-b border-zinc-100 py-2">
                <span>{i.category}</span>
                <span>{i.amount} kr</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-zinc-500 mb-2">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-zinc-400">No expenses logged yet.</p>
        ) : (
          <ul className="space-y-1">
            {expenses.map((e) => (
              <li key={e.id} className="flex justify-between text-sm border-b border-zinc-100 py-2">
                <span>{e.category}</span>
                <span>{e.amount} kr</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}