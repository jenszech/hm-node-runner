# specify the node base image with your desired version node:<version>
FROM node:17

RUN mkdir -p /home/node/app/lib && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node lib/hm-node-runner ./lib
COPY --chown=node:node src ./src

RUN npm config set unsafe-perm true
RUN npm install -g npm
RUN npm install -g typescript
RUN npm install -g ts-node

USER node
RUN npm install
RUN npm run build

EXPOSE 8080

# declares this path for persistent storage
VOLUME ["/home/node/app/config"]
VOLUME ["/home/node/app/data"]
VOLUME ["/home/node/app/logs"]

CMD [ "npm", "start" ]

# EOF