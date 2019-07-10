# This script allow us to simulate a CI run locally.

# Override the .env variable (because localhost is not available within the container):
# https://docs.docker.com/compose/networking/
# https://docs.docker.com/compose/environment-variables/#the-env-file
export API_URI=http://api:3000

# Build all the docker-compose services:
docker-compose build --no-cache web test

# Start, migrate and seed database:
docker-compose up -d db
yarn db:migrate
yarn db:seed

# Launch the e2e tests:
docker-compose up --abort-on-container-exit --exit-code-from test test

# Because we don't want the CI simulation to impact our local tests:
unset API_URI
# https://docs.docker.com/compose/reference/rm/
docker-compose rm -fs
