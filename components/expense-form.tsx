'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { expenseSchema, type ExpenseFormValues, type ExpenseFormInput } from '@/lib/validations'
import { createExpense, updateExpense } from '@/app/actions'

type ExistingExpense = {
  id: string
  amount: number
  date: Date
  category: string
  description: string | null
}

export function ExpenseForm({ expense }: { expense?: ExistingExpense }) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!expense

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
  resolver: zodResolver(expenseSchema),
  defaultValues: {
    amount: expense?.amount,
    date: expense?.date ?? new Date(),
    category: expense?.category ?? '',
    description: expense?.description ?? '',
  },
})

  function onSubmit(values: ExpenseFormValues) {
    startTransition(async () => {
      if (isEditing) {
        await updateExpense(expense.id, values)
      } else {
        await createExpense(values)
        reset({ date: new Date(), category: '', description: '', amount: undefined })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex flex-col gap-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="amount" className="block text-xs text-muted mb-1">
            Amount (NOK)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('amount')}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-xs text-muted mb-1">
            Date
          </label>
          <input
            id="date"
            type="date"
            {...register('date', { valueAsDate: true })}
            defaultValue={(expense?.date ?? new Date()).toISOString().slice(0, 10)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-xs text-muted mb-1">
          Category
        </label>
        <input
          id="category"
          placeholder="e.g. Rent, Groceries"
          {...register('category')}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
        />
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-xs text-muted mb-1">
          Note (optional)
        </label>
        <input
          id="description"
          placeholder="e.g. Rema 1000"
          {...register('description')}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save changes' : 'Add expense')}
      </button>
    </form>
  )
}