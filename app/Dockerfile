FROM node:21-alpine3.18

WORKDIR /app

ARG VERSION="dev"

ENV VERSION=${VERSION}

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]