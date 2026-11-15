# Testing

This readme documents tips for testing processes and procedures.

# Setup

Testing can be done with a remote API key from Ollama or local Ollama models. 

To test with local Ollama models, make sure to install the [Ollama Desktop App](https://ollama.com/download) and download small nimble models for integration testing only like `ollama pull qwen3:4b` in the terminal. Use Ollama's remote API for testing LLM response quality testing against larger remote models.

# Local LLM Testing 

Set `OPEN_AI_BASE_URL = http://host.docker.internal:11434/v1` in `.env`.

# Remote LLM Testing

Set `OPEN_AI_BASE_URL = https://ollama.com/v1` in `.env`.

# Overview

Docker containers for testing are managed with *docker-compose-test.yml*.