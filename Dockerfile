# Gunakan image Node.js versi LTS
FROM node:18-slim

# Set lingkungan kerja dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Expose port aplikasi
EXPOSE 3000

# Menentukan variabel lingkungan untuk host dan port
ENV HOST=0.0.0.0
ENV PORT=3000

# Jalankan aplikasi
CMD ["node", "src/server/server.js"]