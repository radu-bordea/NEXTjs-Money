import Link from "next/link";

const features = [
  {
    title: "Log income & expenses",
    description: "Add entries in seconds — amount, date, category, and an optional note.",
    accent: "income" as const,
  },
  {
    title: "See where money goes",
    description: "Every entry is grouped by category, so patterns show up on their own.",
    accent: "expense" as const,
  },
  {
    title: "Visualize it",
    description: "Charts turn raw entries into a clear picture of income vs. spending over time.",
    accent: "accent" as const,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-4 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          Personal finance, kept simple
        </span>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Ledger
        </h1>

        <p className="mt-4 max-w-md text-muted">
          Track your income and expenses in one place, and see exactly where
          your money comes from and where it goes.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Log in to dashboard
        </Link>

        <p className="mt-3 text-xs text-muted">
          Sign in required — your data is private to your account.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-4 px-6 pb-24 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-surface p-5 text-left"
          >
            <div
              className="mb-3 h-2 w-2 rounded-full"
              style={{ background: `var(--${f.accent})` }}
            />
            <h2 className="text-sm font-medium">{f.title}</h2>
            <p className="mt-1.5 text-sm text-muted">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}