ARG NODE_VERSION=24.13.0-slim

FROM node:${NODE_VERSION} AS dependencies

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]