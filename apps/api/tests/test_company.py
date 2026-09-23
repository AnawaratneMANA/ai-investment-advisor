import pytest
from sqlalchemy import create_engine, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.models import Company, User
from app.services.auth import hash_password


@pytest.fixture
def database_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    Base.metadata.drop_all(engine)
    engine.dispose()


def test_company_creation_and_retrieval(database_session: Session) -> None:
    user = User(email="owner@example.com", password_hash=hash_password("secure-password"))
    database_session.add(user)
    database_session.flush()

    company = Company(
        ticker="COMB.N0000",
        exchange="CSE",
        name="Commercial Bank of Ceylon",
        sector="Banking",
        industry="Commercial Banking",
        created_by_id=user.id,
    )
    database_session.add(company)
    database_session.commit()

    retrieved = database_session.scalar(select(Company).where(Company.ticker == "COMB.N0000"))
    assert retrieved is not None
    assert retrieved.name == "Commercial Bank of Ceylon"
    assert retrieved.created_by.email == "owner@example.com"


def test_duplicate_exchange_ticker_is_rejected(database_session: Session) -> None:
    user = User(email="owner@example.com", password_hash=hash_password("secure-password"))
    database_session.add(user)
    database_session.flush()
    database_session.add(
        Company(ticker="COMB.N0000", exchange="CSE", name="Commercial Bank", created_by_id=user.id)
    )
    database_session.commit()

    database_session.add(
        Company(ticker="COMB.N0000", exchange="CSE", name="Duplicate", created_by_id=user.id)
    )
    with pytest.raises(IntegrityError):
        database_session.commit()
    database_session.rollback()
