FROM node:alpine As dev

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:alpine as prod

WORKDIR /app

COPY --from=dev /app/dist ./dist
COPY --from=dev /app/node_modules ./node_modules
COPY --from=dev /app/package.json ./

EXPOSE 5000

CMD ["node", "dist/main"]