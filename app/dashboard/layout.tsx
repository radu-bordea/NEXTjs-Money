import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { LayoutGrid, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/income", label: "Income", icon: ArrowUpCircle },
  { href: "/dashboard/expenses", label: "Expenses", icon: ArrowDownCircle },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between border-b border-border bg-surface px-6 h-14">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-sm">
            Ledger
          </Link>
          <div className="flex items-center gap-4">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div>
        <UserButton />
      </nav>
      <main>{children}</main>
    </div>
  )
}