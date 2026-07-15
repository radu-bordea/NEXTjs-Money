import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { IncomeExpensePie } from '@/components/income-expense-pie'

function currentMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return { start, end }
}

function formatNOK(amount: number) {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function DashboardPage() {
  const { userId } = await auth.protect()
  const { start, end } = currentMonthRange()

  const [monthIncome, monthExpenses] = await Promise.all([
    prisma.income.findMany({
      where: { userId, date: { gte: start, lt: end } },
      orderBy: { date: 'desc' },
    }),
    prisma.expense.findMany({
      where: { userId, date: { gte: start, lt: end } },
      orderBy: { date: 'desc' },
    }),
  ])

  const totalIncome = monthIncome.reduce((sum, r) => sum + r.amount, 0)
  const totalExpenses = monthExpenses.reduce((sum, r) => sum + r.amount, 0)
  const net = totalIncome - totalExpenses

  const monthLabel = new Date().toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  const recent = [
    ...monthIncome.map((r) => ({ ...r, kind: 'income' as const })),
    ...monthExpenses.map((r) => ({ ...r, kind: 'expense' as const })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8)

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <span className="text-sm text-muted">{monthLabel}</span>
      </div>

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
            className={`text-lg font-semibold ${net >= 0 ? 'text-income' : 'text-expense'}`}
          >
            {net >= 0 ? '+' : ''}
            {formatNOK(net)} kr
          </div>
        </div>
      </div>

      {/* chart + recent activity — stacked on mobile, side by side from md up */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-muted mb-2">
            Income vs. Expenses
          </h2>
          <IncomeExpensePie totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-muted mb-3">Recent activity</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted">Nothing logged yet this month.</p>
          ) : (
            <ul className="space-y-1">
              {recent.map((r) => (
                <li
                  key={`${r.kind}-${r.id}`}
                  className="flex justify-between text-sm border-b border-border py-2 last:border-0"
                >
                  <span className="truncate">{r.category}</span>
                  <span className={r.kind === 'income' ? 'text-income' : 'text-expense'}>
                    {r.kind === 'income' ? '+' : '-'}
                    {formatNOK(r.amount)} kr
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}