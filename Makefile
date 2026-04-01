.PHONY: up down build

# Levanta MySQL + app (Vite :5173, Laravel :8000). Prerrequisito: Docker.
up:
	docker compose up --build

down:
	docker compose down

build:
	docker compose build
