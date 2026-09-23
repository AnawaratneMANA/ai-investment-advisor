"""Minimal long-running worker process for the Docker Compose foundation."""

from __future__ import annotations

import logging
import os
import time


logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("investment-advisor.worker")


def main() -> None:
    logger.info("Worker foundation started; no jobs are registered yet.")
    while True:
        time.sleep(60)


if __name__ == "__main__":
    main()

