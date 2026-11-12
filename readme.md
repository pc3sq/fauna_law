# Fauna Law

Fauna Law is a legal AI assisted platform that provides attorney and legal professionals with legal workflows that expedite and enhance legal work product and services. 



## Testing

# 1. Force a clean build of your images using the fixed requirements parameters
docker compose -f docker-compose-test.yml build

# 2. Run the test suite infrastructure. It will block until tests execute, then dump logs.
docker compose -f docker-compose-test.yml up --abort-on-container-exit --exit-code-from test_runner

# 3. Clean up the sandbox container environment assets completely
docker compose -f docker-compose-test.yml down