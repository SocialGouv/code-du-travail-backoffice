echo "Running master image..."
docker-compose up -d master > /dev/null

echo "Waiting for db image to start..."
# Wait for the 5432 port to be used (= "db" image is running and ready):
while ! lsof -Pi :5432 -sTCP:LISTEN -t; do sleep 1; done > /dev/null

echo "Migrating database structure..."
docker-compose exec master yarn db:migrate > /dev/null
