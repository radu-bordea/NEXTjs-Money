'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Rectangle, LabelList } from 'recharts'
import { ChevronDown } from 'lucide-react'
import type { CurrencyCode } from '@/lib/currency'

const PALETTE = ['#FB7185', '#FBBF24', '#38BDF8', '#A78BFA', '#F472B6', '#34D399', '#818CF8', '#4ADE80']

function colorForCategory(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

function formatCompact(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const COLLAPSED_COUNT = 5

export function ExpensesByCategoryBar({
  data,
  currency,
}: {
  data: { category: string; total: number }[]
  currency: CurrencyCode
}) {
  const [expanded, setExpanded] = useState(false)

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted">
        No expenses yet this month.
      </div>
    )
  }

  const visible = expanded ? data : data.slice(0, COLLAPSED_COUNT)
  const hasMore = data.length > COLLAPSED_COUNT

  // decides per-bar whether the label fits inside it or needs to sit
  // outside in the empty track space — a fixed position="insideRight"
  // works for big bars but clips small ones, so this checks actual
  // bar width against a rough estimate of the label's rendered width
  function renderLabel(props: any) {
    const { x, y, width, height, value } = props
    const text = formatCompact(Number(value), currency)
    const approxTextWidth = text.length * 6.2
    const fitsInside = width > approxTextWidth + 10

    if (fitsInside) {
      return (
        <text
          x={x + width - 8}
          y={y + height / 2}
          dy={4}
          textAnchor="end"
          fill="var(--background)"
          fontSize={10}
          fontWeight={600}
        >
          {text}
        </text>
      )
    }

    return (
      <text
        x={x + width + 6}
        y={y + height / 2}
        dy={4}
        textAnchor="start"
        fill="var(--foreground)"
        fontSize={10}
        fontWeight={600}
      >
        {text}
      </text>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={Math.max(60, visible.length * 40)}>
        <BarChart data={visible} layout="vertical" margin={{ left: 8, right: 48 }}>
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
            <LabelList dataKey="total" content={renderLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-accent hover:underline mt-2"
        >
          {expanded ? 'Show less' : `Show all ${data.length} categories`}
          <ChevronDown
            size={14}
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  )
}