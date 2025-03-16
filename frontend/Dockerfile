FROM node:18-alpine

WORKDIR /app

# Copy package.json from the app subdirectory
COPY app/package*.json ./

RUN npm install

# Copy the app directory contents
COPY app/ .

EXPOSE 3000

CMD ["npm", "start"] 