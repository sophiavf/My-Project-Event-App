# sets the base image to Node.js 14 on Alpine Linux
FROM node:18-alpine
WORKDIR /dist
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 27017
CMD ["npm", "start"]