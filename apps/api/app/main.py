"""Minimal API application entry point for the repository bootstrap."""

from fastapi import FastAPI


app = FastAPI(
    title="AI Investment Advisor API",
    version="0.1.0",
    description="Backend foundation for the AI Investment Advisor.",
)


@app.get("/api/v1/health", tags=["system"])
def health() -> dict[str, str]:
    """Return a minimal service liveness response."""

    return {"status": "ok"}
