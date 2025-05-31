# chmod +x build.sh запустить в первый раз
docker compose down
docker compose build
docker compose up -d