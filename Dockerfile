FROM node:12-alpine

RUN mkdir -p /opt/app && \
    mkdir -p /data/db && \
    mkdir -p /usr/lib/node_modules

# Copy projects folder into container's app folder
COPY . /opt/app

RUN chown -R node:node /opt/app/

# Change to app directory
WORKDIR /opt/app

# Enable debugging port
EXPOSE 9200

# Dont run as root
USER node

RUN npm install
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
