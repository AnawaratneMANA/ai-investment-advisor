# Docker infrastructure

The root `docker-compose.yml` starts the Phase 1 foundation services:

- `frontend` — Next.js development server
- `backend` — FastAPI development server
- `worker` — placeholder long-running worker
- `postgres` — persistent PostgreSQL database
- `redis` — persistent Redis cache/queue foundation

The Dockerfiles in this directory are intentionally minimal. Database migrations, job queues,
and production image hardening belong to later tasks.
