.PHONY: build run stop backup check-docker

check-docker:
    @docker info >/dev/null 2>&1 || (echo "⛔ Docker n'est pas démarré. Lance Docker Desktop puis réessaie." && exit 1)

build: check-docker
    docker compose build

run: check-docker
    docker compose up -d

stop:
    docker compose down