"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { ProtectedShell } from "@/components/protected-shell";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Company } from "@/lib/types";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Company[]>("/api/v1/companies")
      .then(setCompanies)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load companies."))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return companies;
    return companies.filter((company) =>
      [company.name, company.ticker, company.exchange, company.sector].some((value) =>
        value?.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [companies, query]);

  return (
    <ProtectedShell>
      <AppShell>
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-primary">Research workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Companies</h1>
              <p className="mt-2 text-sm text-muted-foreground">Manage the companies attached to your research.</p>
            </div>
            <Link href="/companies/new"><Button>Add company</Button></Link>
          </div>

          <input
            aria-label="Search companies"
            placeholder="Search by name, ticker, exchange, or sector…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-card px-3 outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading companies…</p>
          ) : filteredCompanies.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
              <h2 className="font-semibold">{companies.length ? "No matching companies" : "No companies yet"}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {companies.length ? "Try a different search." : "Add your first company to begin research."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="divide-y divide-border">
                {filteredCompanies.map((company) => (
                  <Link key={company.id} href={`/companies/${company.id}`} className="block p-5 hover:bg-muted/50">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{company.ticker} · {company.exchange}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{company.sector ?? "Sector not set"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedShell>
  );
}

