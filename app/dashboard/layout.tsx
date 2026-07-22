import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import prisma from "@/lib/prisma"
import { LayoutGrid, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { CurrencyPicker } from "@/components/currency-picker"

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/income", label: "Income", icon: ArrowUpCircle },
  { href: "/dashboard/expenses", label: "Expenses", icon: ArrowDownCircle },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth.protect()

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  })

  // no currency chosen yet — show the picker instead of the dashboard,
  // and skip rendering the nav entirely so there's nothing to distract
  // from making this one required choice first
  if (!settings) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <CurrencyPicker />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between border-b border-border bg-surface px-3 sm:px-6 h-14 gap-2">
        <Link href="/" className="font-semibold text-sm shrink-0">
          Ledger
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1 sm:gap-1.5 text-muted transition-colors hover:text-foreground shrink-0 whitespace-nowrap"
            >
              <Icon size={16} className="shrink-0" />
              <span className="text-xs sm:hidden">{label.slice(0, 3)}</span>
              <span className="hidden sm:inline sm:text-sm">{label}</span>
            </Link>
          ))}
        </div>

        <div className="shrink-0">
          <UserButton />
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}