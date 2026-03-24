# Usamos la imagen oficial de Node.js
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos los archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalamos las librerías (incluyendo TypeScript)
RUN npm install

# Copiamos nuestro código fuente
COPY src/ ./src/

# Traducimos TypeScript a JavaScript (esto crea la carpeta /dist)
RUN npm run build

EXPOSE 3000

# Iniciamos la aplicación desde el código traducido
CMD ["npm", "start"]