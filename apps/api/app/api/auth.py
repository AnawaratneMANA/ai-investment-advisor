"""Authentication API routes and current-user dependency."""

from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.errors import AppError
from app.db.session import get_db_session
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, UserCreate, UserRead
from app.services.auth import (
    create_session_token,
    decode_session_token,
    hash_password,
    verify_password,
)


router = APIRouter(tags=["authentication"])
DbSession = Annotated[Session, Depends(get_db_session)]


def set_session_cookie(response: Response, user_id: int) -> None:
    settings = get_settings()
    response.set_cookie(
        key=settings.session_cookie_name,
        value=create_session_token(user_id),
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=settings.session_expire_minutes * 60,
        path="/",
    )


async def get_current_user(
    request: Request,
    db: DbSession,
) -> User:
    settings = get_settings()
    token = request.cookies.get(settings.session_cookie_name)
    user_id = decode_session_token(token) if token else None
    if user_id is None:
        raise AppError("AUTHENTICATION_REQUIRED", "Authentication is required.", status_code=401)

    user = db.scalar(select(User).where(User.id == user_id))
    if user is None or not user.is_active:
        raise AppError("AUTHENTICATION_REQUIRED", "Authentication is required.", status_code=401)
    return user


@router.post("/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: DbSession) -> User:
    email = str(payload.email).lower()
    existing_user = db.scalar(select(User).where(User.email == email))
    if existing_user is not None:
        raise AppError("EMAIL_ALREADY_REGISTERED", "An account with this email already exists.", status_code=409)

    user = User(email=email, password_hash=hash_password(payload.password), role=UserRole.USER.value)
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise AppError("EMAIL_ALREADY_REGISTERED", "An account with this email already exists.", status_code=409) from exc
    db.refresh(user)
    return user


@router.post("/auth/login", response_model=UserRead)
async def login(payload: LoginRequest, response: Response, db: DbSession) -> User:
    email = str(payload.email).lower()
    user = db.scalar(select(User).where(User.email == email))
    if user is None or not user.is_active or not verify_password(payload.password, user.password_hash):
        raise AppError("INVALID_CREDENTIALS", "Email or password is incorrect.", status_code=401)

    set_session_cookie(response, user.id)
    return user


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response) -> None:
    settings = get_settings()
    response.delete_cookie(settings.session_cookie_name, path="/")


@router.get("/me", response_model=UserRead)
async def me(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user
