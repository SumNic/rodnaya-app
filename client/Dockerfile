FROM node:alpine as frontend

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

# Создаем финальный образ
FROM nginx:stable-alpine
COPY --from=frontend /app/dist /usr/share/nginx/html

ARG ENV=dev
ENV ENV=${ENV}

COPY nginx.${ENV}.conf /etc/nginx/nginx.conf

EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
