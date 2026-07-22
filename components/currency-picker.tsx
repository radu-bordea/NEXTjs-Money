'use client'

import { useState, useTransition } from 'react'
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/currency'
import { setUserCurrency } from '@/app/actions'

export function CurrencyPicker() {
  const [selected, setSelected] = useState<CurrencyCode | ''>('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    if (!selected) return
    setError(null)
    startTransition(async () => {
      try {
        await setUserCurrency(selected)
      } catch (err) {
        setError('Something went wrong — please try again.')
      }
    })
  }

  return (
    <div className="max-w-md  p-8 text-center ">
      <h1 className="text-xl font-semibold mb-2">Choose your currency</h1>
      <p className="text-sm text-muted mb-6">
        This can&apos;t be changed later — all your amounts and totals will
        always be tracked in this currency.
      </p>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as CurrencyCode)}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm mb-6"
      >
        <option value="" disabled>
          Select a currency…
        </option>
        {SUPPORTED_CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={!selected || isPending}
        className="rounded-md bg-accent text-background text-sm font-medium px-6 py-2 disabled:opacity-40"
      >
        {isPending ? 'Saving…' : 'Confirm'}
      </button>
    </div>
  )
}