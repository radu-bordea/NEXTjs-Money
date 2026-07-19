'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { incomeSchema, expenseSchema, type IncomeFormValues, type ExpenseFormValues } from '@/lib/validations'
import { redirect } from 'next/navigation'
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/currency'

// create incopme and expense actions that validate the form values, create the record in the database, and revalidate the relevant paths
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

// update income action that validate the form values, update the record in the database, and revalidate the relevant paths
export async function updateIncome(id: string, values: IncomeFormValues) {
  const { userId } = await auth.protect();

  const parsed = incomeSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { amount, date, category, description } = parsed.data;

  await prisma.income.updateMany({
    where: { id, userId }, // scoped by userId — same trick as delete, no separate ownership check needed
    data: { amount, date, category, description: description || null },
  });

  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard");
  redirect("/dashboard/income");
}

// update expense action that validate the form values, update the record in the database, and revalidate the relevant paths
export async function updateExpense(id: string, values: ExpenseFormValues) {
  const { userId } = await auth.protect();

  const parsed = expenseSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { amount, date, category, description } = parsed.data;

  await prisma.expense.updateMany({
    where: { id, userId }, // scoped by userId — same trick as delete, no separate ownership check needed
    data: { amount, date, category, description: description || null },
  });

  revalidatePath("/dashboard/expenses");
  revalidatePath("/dashboard");
  redirect("/dashboard/expenses");
}


// delete income and expense actions that delete the record in the database and revalidate the relevant paths
export async function deleteIncome(id: string) {
  const { userId } = await auth.protect()

  // deleteMany + scoping by userId means we don't even need a separate
  // ownership check — if the id doesn't belong to this user, nothing deletes
  await prisma.income.deleteMany({ where: { id, userId } })

  revalidatePath('/dashboard/income')
  revalidatePath('/dashboard')
}

export async function deleteExpense(id: string) {
  const { userId } = await auth.protect()

  await prisma.expense.deleteMany({ where: { id, userId } })

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
}

export async function toggleExpenseStatus(id:string, currentStatus: 'PAID' | 'UNPAID') {
  const {userId} = await auth.protect()

  const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';

  await prisma.expense.updateMany({
    where: { id, userId },  // same scoping pattern as delete/update — no separate ownership check needed
    data: { status: newStatus }
  })

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
}


// ---------- USER SETTINGS / CURRENCY ----------

// Reads the signed-in user's chosen currency.
// If they haven't picked one yet (no row exists), default to NOK
// rather than throwing — most users won't have set this yet,
// and this keeps every page working even before they've made a choice.
export async function getUserCurrency(): Promise<CurrencyCode> {
  const { userId } = await auth.protect()

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  })

  return (settings?.currency as CurrencyCode) ?? 'NOK'
}

// Creates the signed-in user's currency choice — once only.
// If a row already exists, this refuses to change it: currency is
// locked at signup to avoid ever mixing amounts from two different
// currencies in the same account's totals/charts.
export async function setUserCurrency(currency: CurrencyCode) {
  const { userId } = await auth.protect()

  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    throw new Error('Unsupported currency')
  }

  const existing = await prisma.userSettings.findUnique({
    where: { userId },
  })

  if (existing) {
    throw new Error('Currency is already set and cannot be changed')
  }

  await prisma.userSettings.create({
    data: { userId, currency },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/income')
  revalidatePath('/dashboard/expenses')
}