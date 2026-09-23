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


@pytest.mark.anyio
async def test_register_login_me_and_logout(client: httpx.AsyncClient) -> None:
    credentials = {"email": "analyst@example.com", "password": "correct-horse-battery"}

    register_response = await client.post("/api/v1/auth/register", json=credentials)
    assert register_response.status_code == 201
    assert register_response.json()["email"] == credentials["email"]

    login_response = await client.post("/api/v1/auth/login", json=credentials)
    assert login_response.status_code == 200
    assert "investment_advisor_session" in login_response.cookies

    me_response = await client.get("/api/v1/me")
    assert me_response.status_code == 200
    assert me_response.json()["email"] == credentials["email"]

    logout_response = await client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 204
    assert (await client.get("/api/v1/me")).status_code == 401


@pytest.mark.anyio
async def test_invalid_login_is_rejected(client: httpx.AsyncClient) -> None:
    credentials = {"email": "analyst@example.com", "password": "correct-horse-battery"}
    await client.post("/api/v1/auth/register", json=credentials)

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": credentials["email"], "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"
