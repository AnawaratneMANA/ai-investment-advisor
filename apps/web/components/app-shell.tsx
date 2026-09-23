import Link from "next/link";

import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Dashboard", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Companies", href: "/companies" },
  { label: "Comparisons", href: "/comparisons" },
  { label: "Documents", href: "/documents" },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="border-b border-border px-6 py-5">
          <Link href="/" className="text-base font-semibold tracking-tight">
            AI Investment Advisor
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Research workspace</p>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground">
            Settings
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <Link href="/" className="text-sm font-semibold">
                AI Investment Advisor
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                Configure AI
              </Button>
              <Button variant="ghost" size="sm" aria-label="Open user menu">
                Account
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <nav
          className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-border bg-card p-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-1 py-2 text-center text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

