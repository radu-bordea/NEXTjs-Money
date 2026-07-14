import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 h-14">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-sm">
            Ledger
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            Overview
          </Link>
          <Link href="/dashboard/income" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            Income
          </Link>
          <Link href="/dashboard/expenses" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            Expenses
          </Link>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>
      <main>{children}</main>
    </div>
  )
}