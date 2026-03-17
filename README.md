# Проект "Родная партия"

## Разработка

```
# Бэкэнд. Автоматически использует docker-compose.override.yml
docker compose up

# Или явно
MODE=dev docker compose up

# Фронтенд.
yarn install
yarn dev

# Открытие приложения
Открывать в браузере по адресу http://localhost
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
```
docker compose exec server \
npx sequelize-cli db:migrate \
--config /app/sequelize.config.js
```

## Генерация типов api
```npx openapi-typescript ./server/swagger.json --output ./client/src/utils/api.ts```

## Генерация мобильного приложения
```
cd client
export CAPACITOR_ANDROID_STUDIO_PATH="/snap/android-studio/209/bin/studio.sh"
yarn build && yarn cap sync && yarn cap open android
```