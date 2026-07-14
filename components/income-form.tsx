'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { incomeSchema, type IncomeFormValues } from '@/lib/validations'
import { createIncome } from '@/app/actions'

export function IncomeForm() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date(),
      category: '',
      description: '',
    },
  })

  function onSubmit(values: IncomeFormValues) {
    startTransition(async () => {
      await createIncome(values)
      reset({ date: new Date(), category: '', description: '', amount: undefined })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex flex-col gap-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="number"
            step="0.01"
            placeholder="Amount (NOK)"
            {...register('amount')}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>
        <div>
          <input
            type="date"
            {...register('date', { valueAsDate: true })}
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <input
          placeholder="Category (e.g. Salary, Freelance)"
          {...register('category')}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
        />
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
      </div>

      <input
        placeholder="Note (optional)"
        {...register('description')}
        className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2 hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? 'Adding…' : 'Add income'}
      </button>
    </form>
  )
}