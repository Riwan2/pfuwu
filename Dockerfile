# build
FROM node:16-alpine AS builder

WORKDIR /usr/src/app

COPY client/ client/
COPY assets/ assets/
COPY server/ server/
COPY styles/ styles/
COPY index.html .
COPY index.js .
COPY package-lock.json .
COPY package.json .
COPY snowpack.config.js .

RUN ls
RUN npm ci
RUN npm run build

# final image
FROM node:16-alpine
WORKDIR /usr/src/build

COPY --from=builder /usr/src/app/build .

RUN npm ci --only=production
EXPOSE 3000

CMD [ "npm", "start" ]
