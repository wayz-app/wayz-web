FROM node:21-alpine3.18

WORKDIR /app

ARG VERSION="dev"

ENV REACT_APP_VERSION=${VERSION}
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

COPY package.json package-lock.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]