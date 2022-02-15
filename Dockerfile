FROM node:14.18.1-alpine

WORKDIR /home/node/

COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build; exit 0

CMD ["yarn", "start:prod"]

EXPOSE 80
