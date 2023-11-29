FROM node:16.16-alpine
#FROM node:10-alpine
#FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache g++ gcc make python3 nano

#RUN mkdir src

#RUN mkdir project

COPY . .

RUN yarn install

RUN chown node:node . -R

#CMD ["node","./project/server.js"]

#CMD ["yarn build&watch && yarn start &"]

#ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3000 3001