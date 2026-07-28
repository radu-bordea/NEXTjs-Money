'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Dot } from 'recharts'
import { formatCurrency, type CurrencyCode } from '@/lib/currency'

export function NetTrendLine({
  data,
  currency,
}: {
  data: { month: string; net: number }[]
  currency: CurrencyCode
}) {
  const hasData = data.some((d) => d.net !== 0)

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted">
        Not enough history yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Line
          type="monotone"
          dataKey="net"
          stroke="var(--accent)"
          strokeWidth={2}
          dot={(props: any) => {
            const isNegative = props.payload.net < 0
            return (
              <Dot
                key={props.key}
                cx={props.cx}
                cy={props.cy}
                r={4}
                fill={isNegative ? 'var(--expense)' : 'var(--income)'}
                stroke="none"
              />
            )
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}