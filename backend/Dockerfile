FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

USER node

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
