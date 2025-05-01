FROM node:21-alpine3.18

WORKDIR /app

ARG VERSION="dev"

ENV REACT_APP_VERSION=${VERSION}
ENV REACT_APP_API_URL=https://api.preprod.wayz.ovh
ENV REACT_APP_ORS_API_KEY=5b3ce3597851110001cf6248e9095669c4e345e8b17826953808d978

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]