.PHONY: dev dev-local install test

# Full stack in Docker (MySQL + Laravel :8000 + Vite :5173) — single command
dev:
	docker compose up --build

dev-local:
	composer install && npm ci && composer dev
