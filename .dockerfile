FROM node:18.4.0 as build-image
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY ./ ./
RUN npm install
RUN npm ci
RUN npx tsc

FROM node:18.4.0
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build-image ./usr/src/app/ ./
RUN npm install
RUN npm ci --production
RUN npx prisma db push
RUN npx prisma generate
COPY . .
EXPOSE 8080
CMD [ "node", "dist/src/index.js" ]