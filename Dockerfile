# specify the node base image with your desired version node:<version>
FROM node:18

RUN mkdir -p /home/node/app/lib && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/logs && chown -R node:node /home/node/app/logs
WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node lib/hm-node-runner ./lib
COPY --chown=node:node src ./src

#RUN npm config set unsafe-perm true
RUN npm install -g npm
RUN npm install -g typescript
RUN npm install -g ts-node

USER node
RUN npm install
RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]

# EOF
