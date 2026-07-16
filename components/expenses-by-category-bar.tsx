'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Rectangle, LabelList } from 'recharts'

const PALETTE = ['#FB7185', '#FBBF24', '#38BDF8', '#A78BFA', '#F472B6', '#34D399', '#818CF8', '#4ADE80']

function colorForCategory(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

function formatNOK(amount: number) {
  return `${new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)} kr`
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
    <ResponsiveContainer width="100%" height={Math.max(60, data.length * 40)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 48 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="category"
          width={100}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar
          dataKey="total"
          radius={[0, 6, 6, 0]}
          shape={(props: any) => (
            <Rectangle {...props} fill={colorForCategory(props.payload.category)} />
          )}
        >
          <LabelList
            dataKey="total"
            position="right"
            formatter={(value) => formatNOK(Number(value))}
            fill="var(--foreground)"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}