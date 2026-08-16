import { z } from 'zod'

export const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  date: z.coerce.date(),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
})

export type ExpenseFormValues = z.output<typeof expenseSchema>   // after coercion (number, Date)
export type ExpenseFormInput = z.input<typeof expenseSchema>     // before coercion (raw form values)

// same pattern for incomeSchema:
export const incomeSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  date: z.coerce.date(),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
})

export type IncomeFormValues = z.output<typeof incomeSchema>
export type IncomeFormInput = z.input<typeof incomeSchema>

export const budgetSchema = z.object({
  category: z.string().trim().min(1, 'Category is required'),
  limit: z.coerce.number().positive('Limit must be greater than 0'),
})

export type BudgetFormValues = z.output<typeof budgetSchema>
export type BudgetFormInput = z.input<typeof budgetSchema>