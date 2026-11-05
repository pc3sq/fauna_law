# Add Make commands here. 
.PHONY: up down build rebuild logs restart worker_shell worker_run shell_test_worker shell_test_worker_run test_dashboard

# Allowed environments.
ALLOWED_ENVS := prod test

# Default to test. Run 'make <target> ENV=prod' to switch to prod.
ENV ?= test

CMD ?= bash

# Check if $(ENV) is an allowed environment.
ifeq ($(filter $(ENV),$(ALLOWED_ENVS)),)
    $(error Invalid ENV="$(ENV)". Allowed values for environment `ENV` are: $(ALLOWED_ENVS))
endif

# Set docker compose command to environment.
ifeq ($(ENV), test)
    COMPOSE_CMD := docker compose -f docker-compose-test.yml
else
    COMPOSE_CMD := docker compose -f docker-compose.yml
endif

# Start containers in the background
up:
	$(COMPOSE_CMD) up -d

# Stop and remove containers
down:
	$(COMPOSE_CMD) down

# Regular build
build:
	$(COMPOSE_CMD) build

# Force a clean rebuild ignoring the cache
rebuild:
	$(COMPOSE_CMD) build --no-cache
	$(COMPOSE_CMD) up -d --force-recreate

# View real-time container logs
logs:
	$(COMPOSE_CMD) logs -f

# Hard restart
restart: 
	down up

# Jump inside the container shell (replace 'app' with your service name)
shell_test_worker:
	$(COMPOSE_CMD) exec test_worker bash

shell_test_worker_run:
	$(COMPOSE_CMD) exec test_worker $(CMD)

worker_shell:
	$(COMPOSE_CMD) exec worker bash

worker_run:
	$(COMPOSE_CMD) exec worker $(CMD)

up_test_dashboard:
	$(COMPOSE_CMD) up --build -d test_dashboard

