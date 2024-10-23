FROM node:alpine As development

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:alpine as production

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

COPY --from=development /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/main.js"]