# Usa una imagen base oficial de Node.js para construcción
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala dependencias sin las de desarrollo
RUN npm ci --omit=dev

# Copia el resto del código fuente
COPY . .

# Compila el proyecto
RUN npm run build

# Usa una imagen ligera para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos estáticos construidos al contenedor
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Configura NGINX para usar el puerto
CMD ["nginx", "-g", "daemon off;"]
