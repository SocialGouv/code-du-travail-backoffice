docker-compose up &
# Wait for Postgre port to be used:
while ! sudo lsof -Pi :5432 -sTCP:LISTEN -t; do sleep 1; done
# Wait for PostgREST port to be used:
while ! sudo lsof -Pi :3200 -sTCP:LISTEN -t; do sleep 1; done

yarn build
yarn start &
# Wait for server port port to be used:
while ! sudo lsof -Pi :3100 -sTCP:LISTEN -t; do sleep 1; done
