FROM node:alpine As development

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:alpine as production

WORKDIR /app

COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./

EXPOSE 5000

CMD ["node", "dist/main"]