# Use uma imagem base Node.js
FROM node:18

# Crie e defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o contêiner
COPY package*.json ./

# Instale as dependências
RUN yarn

# Copie o código-fonte para o contêiner
COPY . .

# Exponha a porta 3000 para o mundo exterior
EXPOSE 3333

# Comando para iniciar o aplicativo
CMD ["yarn", "start:dev"]
