import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { IncomeForm } from '@/components/income-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditIncomePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { userId } = await auth.protect()

  const income = await prisma.income.findFirst({
    where: { id, userId },
  })

  if (!income) notFound()

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link
        href="/dashboard/income"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-4"
      >
        <ArrowLeft size={16} />
        Back to Income
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Edit income</h1>
      <IncomeForm income={income} />
    </div>
  )
}