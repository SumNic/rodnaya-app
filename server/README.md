# Проект "Родная партия"

## Разработка

```
# Автоматически использует docker-compose.override.yml
docker-compose up

# Или явно
MODE=dev docker-compose up
```

## Развёртывание

```
# Использует prod конфигурацию
MODE=prod docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```