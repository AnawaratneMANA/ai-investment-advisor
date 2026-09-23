# API

FastAPI backend foundation.

Run from `apps/api` using a project virtual environment. Ubuntu/Debian protects its system
Python installation from direct `pip` writes (PEP 668), so do not install these dependencies
system-wide.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -e '.[test]'
python -m pytest
```

Start the API while the virtual environment is active:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

If `python3 -m venv .venv` reports that the `venv` module is missing, install the matching
Ubuntu package first, for example `sudo apt install python3.14-venv`.

The foundation exposes `GET /api/v1/health` and returns a consistent error envelope for HTTP,
validation, and application errors.

## Database foundation

The API uses SQLAlchemy for database access and Alembic for migrations. The initial migration is
intentionally empty; application tables will be introduced by later tasks.

From `apps/api`, with the virtual environment active:

```bash
alembic upgrade head
python -m pytest
```

Set `DATABASE_URL` to the PostgreSQL URL from Docker Compose when running against the service.
Without it, the development default is a local SQLite file.
