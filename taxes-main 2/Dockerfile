FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .
RUN uv run python manage.py collectstatic --noinput
CMD ["uv", "run", "gunicorn", "taxes.wsgi", "--bind", "0.0.0.0:8000"]