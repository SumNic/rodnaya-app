# chmod +x build.sh запустить в первый раз
docker system prune
docker compose down
docker compose up --build -d