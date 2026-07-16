'use client'

import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, LabelList } from 'recharts'

function formatNOK(value: number) {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function IncomeExpenseTrend({
  data,
}: {
  data: { month: string; income: number; expense: number }[]
}) {
  const hasData = data.some((d) => d.income > 0 || d.expense > 0)

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted">
        Not enough history yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: -20, right: 10, top: 20 }} barGap={6} barCategoryGap="15%">
        <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" name="Income" fill="var(--income)" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="income"
            position="top"
            formatter={(value) => formatNOK(Number(value))}
            fill="var(--income)"
            fontSize={10}
          />
        </Bar>
        <Bar dataKey="expense" name="Expense" fill="var(--expense)" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="expense"
            position="top"
            formatter={(value) => formatNOK(Number(value))}
            fill="var(--expense)"
            fontSize={10}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}