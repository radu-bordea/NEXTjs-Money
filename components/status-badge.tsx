'use client'

import { useTransition } from 'react'
import { toggleExpenseStatus } from '@/app/actions'

type Status = 'PAID' | 'UNPAID'

export function StatusBadge({ id, status }: { id: string; status: Status }) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    const message =
      status === 'UNPAID'
        ? 'Mark this expense as paid?'
        : 'Mark this expense as unpaid again?'
    if (!confirm(message)) return
    startTransition(() => toggleExpenseStatus(id, status))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`text-xs font-medium rounded-full px-2 py-0.5 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 ${
        status === 'PAID'
          ? 'bg-income/15 text-income'
          : 'bg-expense/15 text-expense'
      }`}
    >
      {isPending ? '…' : status === 'PAID' ? 'Paid' : 'Unpaid'}
    </button>
  )
}