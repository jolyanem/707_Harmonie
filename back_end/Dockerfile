FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run postinstall

EXPOSE 3000

CMD ["npm", "run", "start"]