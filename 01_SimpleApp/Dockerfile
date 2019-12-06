FROM node:10

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app

ADD . /app

RUN npm install



CMD ["node", "index.js"]
