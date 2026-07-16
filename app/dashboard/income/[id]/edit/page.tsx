import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { IncomeForm } from '@/components/income-form'

export default async function EditIncomePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth.protect()

  const income = await prisma.income.findFirst({
    where: { id, userId }, // scoped — another user's id here just returns null
  })

  if (!income) notFound()

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Edit income</h1>
      <IncomeForm income={income} />
    </div>
  )
}