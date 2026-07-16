import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { IncomeExpensePie } from '@/components/income-expense-pie'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function parseMonthParam(month?: string) {
  if (month) {
    const [year, m] = month.split('-').map(Number)
    if (year && m) return new Date(year, m - 1, 1)
  }
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

function monthRangeFor(reference: Date) {
  const start = new Date(reference.getFullYear(), reference.getMonth(), 1)
  const end = new Date(reference.getFullYear(), reference.getMonth() + 1, 1)
  return { start, end }
}

function toMonthParam(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatNOK(amount: number) {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const { userId } = await auth.protect()
  const { month } = await searchParams

  const reference = parseMonthParam(month)
  const { start, end } = monthRangeFor(reference)

  const prevMonth = new Date(reference.getFullYear(), reference.getMonth() - 1, 1)
  const nextMonth = new Date(reference.getFullYear(), reference.getMonth() + 1, 1)

  // don't let people navigate into the future past the current month
  const now = new Date()
  const isCurrentMonth =
    reference.getFullYear() === now.getFullYear() && reference.getMonth() === now.getMonth()

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

  const monthLabel = reference.toLocaleDateString('en-GB', {
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
          <span className="text-sm text-muted w-32 text-center">{monthLabel}</span>
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
        {isCurrentMonth ? 'Showing the current month.' : 'Showing a past month — not the current one.'}
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
            <p className="text-sm text-muted">Nothing logged for {monthLabel}.</p>
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