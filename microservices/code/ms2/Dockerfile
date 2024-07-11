# Use the Node 20 image
FROM node:20

# Create and set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (adjust as necessary)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]
