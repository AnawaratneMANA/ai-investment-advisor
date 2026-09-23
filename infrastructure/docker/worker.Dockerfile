FROM python:3.13-slim

WORKDIR /app

COPY workers/worker.py workers/worker.py

CMD ["python", "workers/worker.py"]

