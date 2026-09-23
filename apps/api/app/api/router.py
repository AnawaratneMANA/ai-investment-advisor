"""Versioned API router composition."""

from fastapi import APIRouter

from app.api.auth import router as auth_router


router = APIRouter(prefix="/api/v1")
router.include_router(auth_router)


@router.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    """Return a minimal service liveness response."""

    return {"status": "ok"}
