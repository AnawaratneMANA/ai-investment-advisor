"""Logging configuration for the API service."""

import logging


def configure_logging(level: str = "INFO") -> None:
    """Configure application logging without exposing configuration secrets."""

    numeric_level = getattr(logging, level.upper(), logging.INFO)
    logging.basicConfig(
        level=numeric_level,
        format="%(levelname)s %(name)s %(message)s",
        force=True,
    )

