'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

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
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value.toLocaleString('nb-NO')} kr`}
          contentStyle={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}