sudo service postgresql stop
# Wait for the port to be released (= postgresql service effectively stopped):
while sudo lsof -Pi :5432 -sTCP:LISTEN -t; do sleep 1; done
