# Imagen base con Node y npm
FROM node:24-alpine3.21

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar sólo package.json y package-lock.json
COPY package.json package-lock.json ./
COPY prisma/schema.prisma ./prisma/

# Instalar dependencias con npm ci (limpia y reproducible)
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

# Exponer puerto del dev server de Next.js
EXPOSE 3000

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev"]