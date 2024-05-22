# NodeJS Version 16
FROM node:18-alpine

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app
RUN rm -rf node_modules/

# Install Node Package
RUN npm install

# # Set Env
# ENV NODE_ENV production

EXPOSE 3000

# Cmd script
RUN npm run build
CMD ["npm", "run", "start"]