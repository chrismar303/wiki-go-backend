FROM node:23 AS app

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the project
RUN npm run build

# Expose the application port (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
