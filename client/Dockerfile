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

ARG VITE_VK_ID_APP_PROD
ENV VITE_VK_ID_APP_PROD={VITE_VK_ID_APP_PROD}

ARG VITE_YANDEX_COUNTER_ID_PROD
ENV VITE_YANDEX_COUNTER_ID_PROD={VITE_YANDEX_COUNTER_ID_PROD}

COPY nginx.${MODE}.conf /etc/nginx/nginx.conf

EXPOSE 80 443

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
