FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app
RUN chown node:node /app

COPY --chown=node:node package*.json ./
RUN npm install --production

COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "index.js"]
