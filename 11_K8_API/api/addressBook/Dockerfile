FROM alpine

RUN addgroup -S nodegrp && adduser -S nodeusr -G nodegrp

RUN apk add npm

COPY . /app

WORKDIR /app

RUN npm install

USER nodeusr

EXPOSE 80

CMD ["npm", "start"]
