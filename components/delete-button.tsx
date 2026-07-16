'use client'

import { useTransition } from 'react'

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm('Delete this entry?')) return
        startTransition(() => action())
      }}
      disabled={isPending}
      className="text-xs text-muted hover:text-red-500 disabled:opacity-50 cursor-pointer"
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}