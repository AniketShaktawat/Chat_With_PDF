# Use a base image with Node.js
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build the frontend application
RUN npm run build

# Expose the port the React app runs on
EXPOSE 3000

# Command to run the React server
ENTRYPOINT ["npm", "start"]
