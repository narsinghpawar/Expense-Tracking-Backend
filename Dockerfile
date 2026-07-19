#Step 1 Use node js image
FROM node:22-alpine

#Create and set the working directory
WORKDIR /app

#Copy package files first for better docker layer & caching
COPY package*.json ./

# Install dependencies
RUN npm install

#Copy the application src code
COPY . .

#Expose the port your Express app listens on
EXPOSE 5000

#Start the application
CMD [ "npm","start","dev" ]