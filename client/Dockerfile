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
# ARG ENV=production
ARG ENV=development

COPY nginx.${ENV}.conf /etc/nginx/nginx.conf

EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
