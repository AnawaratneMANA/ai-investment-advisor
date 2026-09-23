"""Create the initial migration checkpoint.

Revision ID: 0001_foundation
Revises:
Create Date: 2026-09-23
"""

from collections.abc import Sequence


revision: str = "0001_foundation"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Establish the migration checkpoint; application tables come later."""


def downgrade() -> None:
    """Remove the migration checkpoint."""

