'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, AlertTriangle, ChevronDown } from 'lucide-react'
import { formatCurrency, type CurrencyCode } from '@/lib/currency'

type UnpaidExpense = {
  id: string
  category: string
  amount: number
  date: Date
}

function daysUntil(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function urgencyLabel(days: number) {
  if (days < 0) return { text: 'Overdue', color: 'text-expense' }
  if (days === 0) return { text: 'Due today', color: 'text-expense' }
  if (days <= 3) return { text: `Due in ${days}d`, color: 'text-yellow-400' }
  return null
}

export function UnpaidBillsPanel({
  expenses,
  total,
  currency,
}: {
  expenses: UnpaidExpense[]
  total: number
  currency: CurrencyCode
}) {
  const [expanded, setExpanded] = useState(false)

  const sorted = [...expenses].sort((a, b) => a.date.getTime() - b.date.getTime())

  // anything overdue or due within 3 days — the ones that actually need attention now
  const urgent = sorted.filter((e) => daysUntil(e.date) <= 3)

  return (
    <div className="rounded-xl border border-expense/30 bg-expense/5 mb-6 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left cursor-pointer hover:bg-expense/5"
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-expense" />
          <h2 className="text-sm font-medium">
            {expenses.length} unpaid this month
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-expense/70">
            {formatCurrency(total, currency)}
          </span>
          <ChevronDown
            size={16}
            className={`text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* visible even when collapsed — the reason this panel exists at all:
          don't let the closest due date hide behind a click */}
      {!expanded && urgent.length > 0 && (
        <div className="px-4 pb-3 -mt-1">
          <div className="flex items-center gap-1.5 text-xs text-yellow-400">
            <AlertTriangle size={13} />
            {urgent.length === 1
              ? `${urgent[0].category} — ${urgencyLabel(daysUntil(urgent[0].date))?.text}`
              : `${urgent.length} bills due within 3 days`}
          </div>
        </div>
      )}

      {expanded && (
        <div className="px-4 pb-4">
          <ul className="space-y-1">
            {sorted.map((e) => {
              const urgency = urgencyLabel(daysUntil(e.date))
              return (
                <li key={e.id} className="flex justify-between items-center text-sm py-1">
                  <span>{e.category}</span>
                  <div className="flex items-center gap-2">
                    {urgency && (
                      <span className={`text-xs font-medium ${urgency.color}`}>
                        {urgency.text}
                      </span>
                    )}
                    <span className="text-xs text-muted">
                      {e.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </span>
                    <span className="text-expense/50">{formatCurrency(e.amount, currency)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
          <Link
            href="/dashboard/expenses"
            className="text-xs text-accent hover:underline mt-2 inline-block"
          >
            Go mark them paid →
          </Link>
        </div>
      )}
    </div>
  )
}