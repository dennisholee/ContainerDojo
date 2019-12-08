const express = require('express')
const http = require('http')
const socket = require('socket.io')
const randomLocation = require('random-location')
const Influx = require('influxdb-nodejs')

const app = express()
const server = http.Server(app)
const io = socket(server)

app.set('view engine', 'ejs')

app.get('/map', (req, res) => {
  res.status(200).render('home')
})

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('coords', function (data) {
    console.log(data);
//    console.log(randomHK())
    socket.emit('passenger', randomHK())
  });
});


const hk = {
  latitude: 22.3964,
  longitude: 114.1096
}

const randomHK = () => randomLocation.randomCirclePoint(hk, 4000)

server.listen(3000, () => {console.log('Listening on 3000')})
