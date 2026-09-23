from collections.abc import AsyncGenerator

import httpx
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db_session
from app.main import app


@pytest.fixture
async def client() -> AsyncGenerator[httpx.AsyncClient, None]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    async def override_session() -> AsyncGenerator[Session, None]:
        session = session_factory()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db_session] = override_session
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)
    engine.dispose()


async def register_and_login(client: httpx.AsyncClient, email: str) -> None:
    credentials = {"email": email, "password": "correct-horse-battery"}
    assert (await client.post("/api/v1/auth/register", json=credentials)).status_code == 201
    assert (await client.post("/api/v1/auth/login", json=credentials)).status_code == 200


@pytest.mark.anyio
async def test_company_crud_for_authenticated_user(client: httpx.AsyncClient) -> None:
    await register_and_login(client, "owner@example.com")
    payload = {
        "ticker": "comb.n0000",
        "exchange": "cse",
        "name": "Commercial Bank of Ceylon",
        "sector": "Banking",
    }

    created = await client.post("/api/v1/companies", json=payload)
    assert created.status_code == 201
    company = created.json()
    assert company["ticker"] == "COMB.N0000"
    assert company["exchange"] == "CSE"

    listed = await client.get("/api/v1/companies")
    assert listed.status_code == 200
    assert [item["id"] for item in listed.json()] == [company["id"]]

    retrieved = await client.get(f"/api/v1/companies/{company['id']}")
    assert retrieved.status_code == 200

    updated = await client.put(
        f"/api/v1/companies/{company['id']}",
        json={"name": "Commercial Bank of Ceylon PLC"},
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Commercial Bank of Ceylon PLC"


@pytest.mark.anyio
async def test_company_api_requires_authentication(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/v1/companies")

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "AUTHENTICATION_REQUIRED"


@pytest.mark.anyio
async def test_duplicate_company_is_rejected(client: httpx.AsyncClient) -> None:
    await register_and_login(client, "owner@example.com")
    payload = {"ticker": "COMB.N0000", "exchange": "CSE", "name": "Commercial Bank"}

    assert (await client.post("/api/v1/companies", json=payload)).status_code == 201
    duplicate = await client.post("/api/v1/companies", json=payload)

    assert duplicate.status_code == 409
    assert duplicate.json()["error"]["code"] == "COMPANY_ALREADY_EXISTS"
