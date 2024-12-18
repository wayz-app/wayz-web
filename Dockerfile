FROM node:21-alpine3.18
WORKDIR /app
COPY app/. .
RUN npm install
RUN npm install -g nodemon
CMD ["nodemon", "start"]