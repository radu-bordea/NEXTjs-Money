import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ExpenseForm } from '@/components/expense-form'

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth.protect()

  const expense = await prisma.expense.findFirst({
    where: { id, userId },
  })

  if (!expense) notFound()

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Edit expense</h1>
      <ExpenseForm expense={expense} />
    </div>
  )
}