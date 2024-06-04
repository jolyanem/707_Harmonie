FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run postinstall

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start"]