# Проект "Родная партия"

## Разработка

```
# Автоматически использует docker-compose.override.yml
docker compose up

# Или явно
MODE=dev docker compose up
```

## Развёртывание

```
# Использует prod конфигурацию
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

```
# Остановить и удалить контейнеры
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## Миграции
# Генерация
```npx sequelize-cli migration:generate --name this-name```
# Применение
```docker compose exec server yarn migrate```

## Генерация типов api
```npx openapi-typescript ./server/swagger.json --output ./client/src/utils/api.ts```