'use client'

import { useTransition } from 'react'
import { toggleExpenseStatus } from '@/app/actions'

type Status = 'PAID' | 'UNPAID'

export function StatusBadge({ id, status }: { id: string; status: Status }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => toggleExpenseStatus(id, status))}
      disabled={isPending}
      className={`text-xs font-medium rounded-full px-2 py-0.5 transition-opacity hover:opacity-80 disabled:opacity-50 ${
        status === 'PAID'
          ? 'bg-income/15 text-income'
          : 'bg-expense/15 text-expense'
      }`}
    >
      {isPending ? '…' : status === 'PAID' ? 'Paid' : 'Unpaid'}
    </button>
  )
}