# JSON Server Dockerfile
FROM node:18-alpine

# Install json-server globally
RUN npm install -g json-server

# Set working directory
WORKDIR /app

# Copy JSON data file
COPY db.json ./

# Expose port
EXPOSE 3002

# Start json-server
CMD ["json-server", "--watch", "db.json", "--host", "0.0.0.0", "--port", "3002"]