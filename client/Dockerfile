FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

# Создаем финальный образ
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

ARG MODE=dev
ENV MODE=${MODE}

COPY nginx.${MODE}.conf /etc/nginx/nginx.conf

EXPOSE 80 443

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
