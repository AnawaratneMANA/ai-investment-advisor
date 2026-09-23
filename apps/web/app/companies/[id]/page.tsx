"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { CompanyForm } from "@/components/company-form";
import { ProtectedShell } from "@/components/protected-shell";
import { apiFetch } from "@/lib/api";
import type { Company } from "@/lib/types";

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    apiFetch<Company>(`/api/v1/companies/${params.id}`)
      .then(setCompany)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load company."))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  return (
    <ProtectedShell>
      <AppShell>
        <div className="mx-auto max-w-5xl space-y-6">
          <Link href="/companies" className="text-sm text-primary hover:underline">← Back to companies</Link>
          {isLoading && <p className="text-sm text-muted-foreground">Loading company…</p>}
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {company && (
            <>
              <div>
                <p className="text-sm font-medium text-primary">{company.ticker} · {company.exchange}</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight">{company.name}</h1>
                <p className="mt-2 text-sm text-muted-foreground">Company workspace</p>
              </div>
              <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
                <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <h2 className="font-semibold">Overview</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <Summary label="Sector" value={company.sector} />
                    <Summary label="Industry" value={company.industry} />
                    <Summary label="Country" value={company.country} />
                    <Summary label="Currency" value={company.currency} />
                    <Summary label="Website" value={company.website} />
                  </dl>
                </section>
                <section className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
                  <h2 className="mb-5 text-lg font-semibold">Edit company</h2>
                  <CompanyForm company={company} />
                </section>
              </div>
            </>
          )}
        </div>
      </AppShell>
    </ProtectedShell>
  );
}

function Summary({ label, value }: { label: string; value: string | null }) {
  return <div className="flex justify-between gap-4 border-b border-border pb-2"><dt className="text-muted-foreground">{label}</dt><dd className="text-right">{value ?? "Not set"}</dd></div>;
}

