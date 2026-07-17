'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ChevronDown } from 'lucide-react'

type UnpaidExpense = {
  id: string
  category: string
  amount: number
  date: Date
}

function formatNOK(amount: number) {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function UnpaidBillsPanel({
  expenses,
  total,
}: {
  expenses: UnpaidExpense[]
  total: number
}) {
  const [expanded, setExpanded] = useState(false)

  const sorted = [...expenses].sort((a, b) => a.date.getTime() - b.date.getTime())

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
            {formatNOK(total)} kr
          </span>
          <ChevronDown
            size={16}
            className={`text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <ul className="space-y-1">
            {sorted.map((e) => (
              <li key={e.id} className="flex justify-between text-sm py-1">
                <span>{e.category}</span>
                <span className="text-xs text-muted">
                  {e.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
                <span className="text-expense/50">{formatNOK(e.amount)} kr</span>
              </li>
            ))}
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