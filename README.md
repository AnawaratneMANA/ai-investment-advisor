# AI Investment Advisor

Self-hosted AI-assisted investment research workspace for CSE and general equity research.

This repository is organized as a small monorepo. The implementation follows the controlled,
incremental task sequence in the solution design materials. The repository bootstrap and Docker
Compose foundation are implemented at this stage.

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

## Local development

Copy the environment file and start the foundation stack:

```bash
cp .env.example .env
docker compose up -d
docker compose ps
```

The API health endpoint is available at `http://localhost:8000/api/v1/health` and the frontend at
`http://localhost:3000`.

Stop the stack with:

```bash
docker compose down
```

No secrets should be committed to this repository.
