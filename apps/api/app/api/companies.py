"""Company CRUD API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.errors import AppError
from app.db.session import get_db_session
from app.models.company import Company
from app.models.user import User
from app.schemas.company import CompanyCreate, CompanyRead, CompanyUpdate


router = APIRouter(prefix="/companies", tags=["companies"])
DbSession = Annotated[Session, Depends(get_db_session)]
CurrentUser = Annotated[User, Depends(get_current_user)]


def normalize_identifier(value: str) -> str:
    return value.strip().upper()


def company_values(payload: CompanyCreate | CompanyUpdate) -> dict[str, object]:
    values = payload.model_dump(exclude_unset=True)
    for field in ("ticker", "exchange"):
        if field in values and values[field] is not None:
            values[field] = normalize_identifier(str(values[field]))
    if "website" in values and values["website"] is not None:
        values["website"] = str(values["website"])
    return values


def find_owned_company(db: Session, company_id: int, user_id: int) -> Company:
    company = db.scalar(
        select(Company).where(Company.id == company_id, Company.created_by_id == user_id)
    )
    if company is None:
        raise AppError("COMPANY_NOT_FOUND", "Company was not found.", status_code=404)
    return company


@router.get("", response_model=list[CompanyRead])
async def list_companies(db: DbSession, current_user: CurrentUser) -> list[Company]:
    return list(
        db.scalars(
            select(Company)
            .where(Company.created_by_id == current_user.id)
            .order_by(Company.name.asc())
        )
    )


@router.post("", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
async def create_company(
    payload: CompanyCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> Company:
    company = Company(**company_values(payload), created_by_id=current_user.id)
    db.add(company)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise AppError(
            "COMPANY_ALREADY_EXISTS",
            "A company with this ticker already exists on this exchange.",
            status_code=409,
        ) from exc
    db.refresh(company)
    return company


@router.get("/{company_id}", response_model=CompanyRead)
async def get_company(company_id: int, db: DbSession, current_user: CurrentUser) -> Company:
    return find_owned_company(db, company_id, current_user.id)


@router.put("/{company_id}", response_model=CompanyRead)
async def update_company(
    company_id: int,
    payload: CompanyUpdate,
    db: DbSession,
    current_user: CurrentUser,
) -> Company:
    company = find_owned_company(db, company_id, current_user.id)
    for field, value in company_values(payload).items():
        setattr(company, field, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise AppError(
            "COMPANY_ALREADY_EXISTS",
            "A company with this ticker already exists on this exchange.",
            status_code=409,
        ) from exc
    db.refresh(company)
    return company

