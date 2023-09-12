FROM node:alpine

# Instale o Yarn
RUN npm install -g yarn

WORKDIR /usr/app

COPY package.json ./

RUN yarn 

COPY . . 

EXPOSE 3333

CMD ["yarn", "start:dev"]
