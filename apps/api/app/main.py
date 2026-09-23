"""Minimal API application entry point for the repository bootstrap."""

from fastapi import FastAPI


app = FastAPI(
    title="AI Investment Advisor API",
    version="0.1.0",
    description="Backend foundation for the AI Investment Advisor.",
)

