# AI Investment Advisor

Self-hosted AI-assisted investment research workspace for CSE and general equity research.

This repository is organized as a small monorepo and follows the controlled, incremental task
sequence in the solution design materials. The current development line includes the foundation,
authentication, and company workspace capabilities. Document processing and financial analysis are
planned next.

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

## Current capability boundary

Implemented:

- Docker Compose development stack
- Next.js + React + TypeScript frontend
- FastAPI backend with `/api/v1` routing
- PostgreSQL and Redis services
- SQLAlchemy and Alembic migrations
- User registration, login, logout, and protected sessions
- Argon2 password hashing and HttpOnly session cookies
- Company domain model and authenticated Company CRUD API
- Company list, search, create, detail, and edit UI

Not implemented yet:

- Document upload and storage
- PDF/DOCX/XLSX processing
- Evidence extraction and source citations
- Financial statement analysis
- Valuation and technical analysis
- Company comparison
- AI provider configuration
- Automatic document discovery
- Research report generation

See [docs/USER_WORKFLOW.md](docs/USER_WORKFLOW.md) for the intended end-to-end research journey.

## Clean-environment setup

### Requirements

The recommended setup requires Git and Docker Engine with Docker Compose v2. Python 3.13+ and
Node.js 22 are optional when running services directly on the host. Docker access may require
configuring the Docker group or prefixing commands with `sudo`.

### Docker setup

```bash
git clone <repository-url> ai-investment-advisor
cd ai-investment-advisor
cp .env.example .env
```

Generate a private local authentication secret:

```bash
openssl rand -hex 32
```

Put the result in `.env` as `AUTH_SECRET_KEY`, then start the stack:

```bash
docker compose up -d --build
docker compose ps
docker compose exec backend alembic upgrade head
```

Verify the API at [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) and
open the web application at [http://localhost:3000](http://localhost:3000).

Services:

| Service | Purpose |
| --- | --- |
| `frontend` | Next.js application on port `3000` |
| `backend` | FastAPI API on port `8000` |
| `postgres` | Persistent PostgreSQL database on port `5432` |
| `redis` | Persistent Redis service on port `6379` |
| `worker` | Reserved background process |

Useful commands:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f
docker compose down
docker compose up -d --build
```

Do not use `docker compose down -v` unless you intentionally want to delete the local PostgreSQL
and Redis volumes.

### Authentication quick start

1. Open [http://localhost:3000/register](http://localhost:3000/register).
2. Create a user with an email and a password of at least eight characters.
3. Refresh the page to verify session persistence.
4. Use **Log out** to end the session.

Authentication endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/me
```

### Company workspace quick start

After logging in, open [http://localhost:3000/companies](http://localhost:3000/companies), select
**Add company**, and enter for example:

```text
Name:     Commercial Bank of Ceylon
Ticker:   COMB.N0000
Exchange: CSE
```

The company can then be searched, opened, and edited. Company API endpoints are:

```text
GET  /api/v1/companies
POST /api/v1/companies
GET  /api/v1/companies/{id}
PUT  /api/v1/companies/{id}
```

### Optional host-based development

API:

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[test]'
alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
python -m pytest
```

Ubuntu/Debian may reject system-wide `pip install` because of PEP 668. Use the virtual environment
instead of `--break-system-packages`.

Web:

```bash
cd apps/web
nvm install
nvm use
npm ci
npm run dev
```

The project pins Node.js 22 in `apps/web/.nvmrc`. Use `npm run build` for frontend verification.
The browser API URL defaults to `http://localhost:8000` and can be changed with
`NEXT_PUBLIC_API_URL`.

## Environment configuration

`.env.example` is tracked. `.env` is local-only and must not be committed.

| Variable | Purpose |
| --- | --- |
| `APP_ENV` | Runtime environment name |
| `LOG_LEVEL` | Backend log level |
| `AUTH_SECRET_KEY` | Signs authentication session tokens |
| `WEB_ORIGIN` | Comma-separated browser origins allowed by CORS |
| `API_PORT` | Host port for FastAPI |
| `WEB_PORT` | Host port for Next.js |
| `POSTGRES_DB` | PostgreSQL database name |
| `POSTGRES_USER` | PostgreSQL user |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `REDIS_URL` | Redis connection URL |

Never use a shared or public `AUTH_SECRET_KEY` outside local development.

## Troubleshooting

If new source changes are not visible, rebuild instead of only starting existing containers:

```bash
docker compose up -d --build
```

For CORS errors, make sure the browser URL matches `WEB_ORIGIN`, then rebuild `backend` and
`frontend`. For migration errors, rebuild the backend and run:

```bash
docker compose exec backend alembic upgrade head
```

If the API reports `No module named psycopg2`, rebuild the backend with:

```bash
docker compose build --no-cache backend
docker compose up -d backend
```

## Product development status

```text
Phase 1 — Foundation       complete through authentication
Phase 2 — Documents        company domain/API/UI in progress
Phase 3 — Financial        planned
Phase 4 — Research         planned
Phase 5 — Technical        planned
Phase 6 — Comparison       planned
Phase 7 — Automation       planned
Phase 8 — Advanced         planned
```

Implementation is checkpointed: each task should be implemented, tested, manually verified, and
acknowledged before the next task begins.

The product is an evidence-first research assistant. It should show source evidence,
calculations, assumptions, scenarios, risks, and uncertainty. It must not present an AI-generated
score or BUY/SELL verdict as objective truth. Users remain responsible for their own investment
decisions.
