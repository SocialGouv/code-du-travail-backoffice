# TODO Use env vars for ports instead of hard-written values.

ENV_FILE="$PWD/.env"
BLUE="\033[0;34m"
GREEN="\033[0;32m"
NC='\033[0m'

# Load .env file variables if the file exists:
echo $ENV_FILE
if [ -f $ENV_FILE ]
then
  echo "${GREEN}> Exporting .env file variables...${NC}"
  export $(cat $ENV_FILE | xargs)
fi

echo "${GREEN}> Stopping all existing containers...${NC}"
docker stop $(docker ps -a -q) > /dev/null

echo "${GREEN}> Starting master (and db) image...${NC}"
docker-compose up -d master > /dev/null

echo "${GREEN}> Waiting for db image to start...${NC}"
while ! lsof -Pi :$DB_PORT -sTCP:LISTEN -t; do sleep 1; done > /dev/null

echo "${GREEN}> Migrating database structure...${NC}"
docker-compose exec master yarn db:migrate > /dev/null

echo "${GREEN}> Stopping master image...${NC}"
docker-compose stop master > /dev/null
echo "${GREEN}> Stopping db image...${NC}"
docker-compose stop db > /dev/null

echo "${GREEN}> Starting api (and db) image...${NC}"
docker-compose up -d api > /dev/null

echo "${GREEN}> Waiting for api image to start...${NC}"
while ! lsof -Pi :$API_PORT -sTCP:LISTEN -t; do sleep 1; done > /dev/null

echo "${GREEN}> Starting web image...${NC}"
docker-compose up --build -d web > /dev/null

echo "${GREEN}> Waiting for web image to start...${NC}"
while ! lsof -Pi :$WEB_PORT -sTCP:LISTEN -t; do sleep 1; done > /dev/null

echo "${BLUE}The server is up:"
echo "- api is running on port $API_PORT"
echo "- web is running on port $WEB_PORT${NC}"
