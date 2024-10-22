FROM node:alpine as frontend

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

# Создаем финальный образ
FROM nginx:stable-alpine
COPY --from=frontend /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Создаем директории для логов и PID
RUN mkdir -p /var/log/nginx /var/run/nginx && \
    touch /var/log/nginx/error.log && \
    touch /var/run/nginx/nginx.pid && \
    chown -R nginx:nginx /var/log/nginx /var/run/nginx

USER nginx

EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
