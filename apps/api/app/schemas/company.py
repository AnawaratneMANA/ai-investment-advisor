"""Company API schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CompanyCreate(BaseModel):
    ticker: str = Field(min_length=1, max_length=32)
    exchange: str = Field(min_length=1, max_length=32)
    name: str = Field(min_length=1, max_length=255)
    sector: str | None = Field(default=None, max_length=120)
    industry: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    currency: str | None = Field(default=None, max_length=12)
    website: HttpUrl | None = None
    description: str | None = None


class CompanyUpdate(BaseModel):
    ticker: str | None = Field(default=None, min_length=1, max_length=32)
    exchange: str | None = Field(default=None, min_length=1, max_length=32)
    name: str | None = Field(default=None, min_length=1, max_length=255)
    sector: str | None = Field(default=None, max_length=120)
    industry: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, max_length=120)
    currency: str | None = Field(default=None, max_length=12)
    website: HttpUrl | None = None
    description: str | None = None


class CompanyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticker: str
    exchange: str
    name: str
    sector: str | None
    industry: str | None
    country: str | None
    currency: str | None
    website: HttpUrl | None
    description: str | None
    created_by_id: int
    created_at: datetime
    updated_at: datetime

