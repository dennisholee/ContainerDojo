FROM node:10

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app

ADD . /app

RUN npm install

EXPOSE 3000

USER node

# CMD ["node", "index.js"]

# RUN chmod u+x ./wait_for_redis.sh
