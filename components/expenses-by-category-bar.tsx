'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PALETTE = ['#FB7185', '#FBBF24', '#38BDF8', '#A78BFA', '#F472B6', '#34D399', '#818CF8', '#4ADE80']

function colorForCategory(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

export function ExpensesByCategoryBar({
  data,
}: {
  data: { category: string; total: number }[]
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted">
        No expenses yet this month.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="category"
          width={100}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => `${Number(value).toLocaleString('nb-NO')} kr`}
          contentStyle={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Bar dataKey="total" radius={[0, 6, 6, 0]}>
          {data.map((entry) => (
            <Cell key={entry.category} fill={colorForCategory(entry.category)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}