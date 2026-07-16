'use client'

import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'

function formatNOK(amount: number) {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function IncomeExpensePie({
  totalIncome,
  totalExpenses,
}: {
  totalIncome: number
  totalExpenses: number
}) {
  const data = [
    { name: 'Income', value: totalIncome, color: 'var(--income)' },
    { name: 'Expenses', value: totalExpenses, color: 'var(--expense)' },
  ]

  const hasData = totalIncome > 0 || totalExpenses > 0

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted">
        No data yet this month.
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            strokeWidth={0}
            shape={(props: any) => <Sector {...props} fill={props.payload.color} />}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--income)' }} />
          <span className="text-muted">Income</span>
          <span className="font-medium text-income">{formatNOK(totalIncome)} kr</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--expense)' }} />
          <span className="text-muted">Expenses</span>
          <span className="font-medium text-expense">{formatNOK(totalExpenses)} kr</span>
        </div>
      </div>
    </div>
  )
}