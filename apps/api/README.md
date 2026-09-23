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
validation, and application errors. Database and business modules will be added in later tasks.
