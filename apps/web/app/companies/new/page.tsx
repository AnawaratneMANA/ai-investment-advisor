import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { CompanyForm } from "@/components/company-form";
import { ProtectedShell } from "@/components/protected-shell";

export default function NewCompanyPage() {
  return (
    <ProtectedShell>
      <AppShell>
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <Link href="/companies" className="text-sm text-primary hover:underline">← Back to companies</Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Add company</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create a company workspace for research and documents.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"><CompanyForm /></div>
        </div>
      </AppShell>
    </ProtectedShell>
  );
}

