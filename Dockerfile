FROM node:22-alpine

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npx", "nodemon", "src/app.js"]
