# base image Node.js
FROM node:18

# working directory
WORKDIR /app

# salin package.json dan package-lock.json
COPY package*.json ./

# instal dependencies
RUN npm install

# salin semua kode aplikasi ke dalam container
COPY . .

# set variabel lingkungan untuk port dan host
ENV PORT 8080
ENV HOST 0.0.0.0

# ekspos port aplikasi
EXPOSE 8080

# run aplikasi
CMD ["node", "src/server/server.js"]
