FROM node:latest

EXPOSE 4000

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

COPY . .

#RUN npm install

#
CMD ["node","index.js"]