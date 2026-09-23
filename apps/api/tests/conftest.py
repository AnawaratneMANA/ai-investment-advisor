import pytest


@pytest.fixture
def anyio_backend() -> str:
    """Run the async API tests with the asyncio backend only."""

    return "asyncio"

