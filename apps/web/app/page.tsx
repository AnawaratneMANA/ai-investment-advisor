import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-medium text-primary">Research workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Good research starts with evidence.</h1>
          <p className="max-w-2xl text-muted-foreground">
            Organize company documents, financial analysis, market data, and AI-assisted insights
            in one traceable workspace.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button>Analyze a company</Button>
            <Button variant="outline">Upload documents</Button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace status">
          {[
            ["Active research", "0", "Company workspaces in progress"],
            ["Recent reports", "0", "Generated research reports"],
            ["Documents", "0", "Source documents collected"],
            ["System status", "Ready", "Foundation services configured"],
          ].map(([label, value, description]) => (
            <article key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">Your research workspace is ready</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Company workspaces, document ingestion, and analysis modules will appear here as the
            next foundation tasks are completed.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
