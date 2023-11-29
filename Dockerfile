FROM node:16.16-alpine

WORKDIR /app

RUN apk add --no-cache g++ gcc make python3 nano

COPY . .

RUN chown node:node . -R

RUN npm install

CMD ["node","./server.js"]

EXPOSE 3000 3001