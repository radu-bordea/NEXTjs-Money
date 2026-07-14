'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { incomeSchema, expenseSchema, type IncomeFormValues, type ExpenseFormValues } from '@/lib/validations'

export async function createIncome(values: IncomeFormValues) {
  const { userId } = await auth.protect()

  const parsed = incomeSchema.safeParse(values)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { amount, date, category, description } = parsed.data

  await prisma.income.create({
    data: { userId, amount, date, category, description: description || null },
  })

  revalidatePath('/dashboard/income')
  revalidatePath('/dashboard')
}

export async function createExpense(values: ExpenseFormValues) {
  const { userId } = await auth.protect()

  const parsed = expenseSchema.safeParse(values)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { amount, date, category, description } = parsed.data

  await prisma.expense.create({
    data: { userId, amount, date, category, description: description || null },
  })

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
}