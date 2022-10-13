FROM node:latest

EXPOSE 4000

WORKDIR /usr/src/app

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

COPY . /usr/src/app

RUN npm install

CMD ["node","index1.js"]