"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Company } from "@/lib/types";

type CompanyFormProps = { company?: Company };

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    ticker: company?.ticker ?? "",
    exchange: company?.exchange ?? "CSE",
    name: company?.name ?? "",
    sector: company?.sector ?? "",
    industry: company?.industry ?? "",
    country: company?.country ?? "Sri Lanka",
    currency: company?.currency ?? "LKR",
    website: company?.website ?? "",
    description: company?.description ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    const payload = {
      ...form,
      sector: form.sector || null,
      industry: form.industry || null,
      country: form.country || null,
      currency: form.currency || null,
      website: form.website || null,
      description: form.description || null,
    };

    try {
      const saved = await apiFetch<Company>(
        company ? `/api/v1/companies/${company.id}` : "/api/v1/companies",
        { method: company ? "PUT" : "POST", body: JSON.stringify(payload) },
      );
      router.push(`/companies/${saved.id}`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save company.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name" value={form.name} required onChange={(value) => updateField("name", value)} />
        <Field label="Ticker" value={form.ticker} required onChange={(value) => updateField("ticker", value)} />
        <Field label="Exchange" value={form.exchange} required onChange={(value) => updateField("exchange", value)} />
        <Field label="Sector" value={form.sector} onChange={(value) => updateField("sector", value)} />
        <Field label="Industry" value={form.industry} onChange={(value) => updateField("industry", value)} />
        <Field label="Country" value={form.country} onChange={(value) => updateField("country", value)} />
        <Field label="Currency" value={form.currency} onChange={(value) => updateField("currency", value)} />
        <Field label="Website" type="url" value={form.website} onChange={(value) => updateField("website", value)} />
      </div>
      <label className="block space-y-2 text-sm font-medium" htmlFor="description">
        Description
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </label>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving…" : company ? "Save changes" : "Create company"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  required = false,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  type?: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <label className="block space-y-2 text-sm font-medium" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-border bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </label>
  );
}

