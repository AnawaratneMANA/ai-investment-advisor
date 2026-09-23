# AI Investment Advisor

Self-hosted AI-assisted investment research workspace for CSE and general equity research.

This repository is organized as a small monorepo. The implementation follows the controlled,
incremental task sequence in the solution design materials. Only the repository bootstrap is
implemented at this stage.

## Repository layout

```text
apps/
  api/              FastAPI backend foundation
  web/              Next.js frontend foundation
workers/            Background worker entry points (future)
packages/
  prompts/          Versioned AI prompts (future)
  schemas/          Shared schemas/contracts (future)
  shared/           Shared utilities (future)
infrastructure/
  docker/           Container support files (future)
docs/               Project documentation
data/               Local runtime data mount points (not source data)
```

## Planned local development

The next foundation tasks will add Docker Compose, the FastAPI health endpoint, the Next.js
application shell, and PostgreSQL/Alembic integration. Do not treat the placeholder directories
as implemented services yet.

## Initial setup

```bash
cp .env.example .env
```

No secrets should be committed to this repository.

