FROM node:10-alpine

ARG server_version

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# Installing JS dependencies
RUN apk --no-cache add --virtual build-dependencies \
  g++ \
  gcc \
  libgcc \
  libstdc++ \
  linux-headers \
  make \
  python && \
  npm install node-gyp -g && \
  yarn install --production && \
  yarn cache clean && \
  npm cache clean --force && \
  apk del build-dependencies

COPY build .

ENV NODE_ENV=production
ENV VERSION=$server_version

EXPOSE 3003

CMD node index.js
