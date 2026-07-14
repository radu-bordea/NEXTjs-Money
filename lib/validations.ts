import { z } from 'zod'

export const incomeSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  date: z.coerce.date(),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
})

export const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  date: z.coerce.date(),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
})

export type IncomeFormValues = z.infer<typeof incomeSchema>
export type ExpenseFormValues = z.infer<typeof expenseSchema>