const express = require('express')
const http = require('http')
const socket = require('socket.io')
const randomLocation = require('random-location')
const InfluxDB = require('influxdb-nodejs')
const retry = require('retry')

const app = express()
const server = http.Server(app)
const io = socket(server)

app.set('view engine', 'ejs')

//======================================================================= routes
app.get('/map', (req, res) => {
  res.status(200).render('home')
})

// Get passenger coordinates
// TODO: Differentiate passengers ... by "Group By"?
app.get('/passengers', async (req, res) => {
  let data = await queryPassengers()
  res.status(200).send(data)
})

//==================================================================== socket io

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('coords', function (data) {
//    console.log(data);
//    console.log(randomHK())
    writeCoords(data)
    socket.emit('passenger', randomHK())
  });
});


//================================================================= geolocations

const hk = { latitude: 22.3964, longitude: 114.1096 }

const randomHK = () => randomLocation.randomCirclePoint(hk, 4000)

//==================================================================== Influx DB

const dbName = "mydb"
const dbHost = 'influxdb'
const dbPort = '8086'

// TODO: Define schema for driver and passenger's geolocation
const schema = [{
  measurement: 'passenger',
  tags: ['host'],
  fields: {
    lng: 'float',
    lat: 'float',
  }
}]



// TODO: dynamic locate neighbouring container i.e. InfluxDB
// docker container inspect <container id> | less
// Grep 'IPAddress' 
const influx = new InfluxDB(`http://${dbHost}:${dbPort}/${dbName}`)

// Create database if it doesn't exists
// var operation = retry.operation({retries: 3, maxTimeout: 5000})

const connect2db = () => {
  var operation = retry.operation({retries: 3, maxTImeout: 5000})

  operation.attempt(currentAttempt => {
    influx.showDatabases()
      .then(names => {
        if(!names.includes(dbName)) {
          return influx.createDatabase(dbName);
        } 
      })
      .catch(e => {
	 console.log(e)
	 operation.retry(e)
      })
    
  })
}

connect2db((err) => {
  console.log(`connect2db error: ${JSON.stringify(err)}`)
})

//operation.attempt(currentAttempt => {
//  influx.showDatabases()
//    .then(names => {
//      console.log('names' + JSON.stringify(names))
//      if(!names.includes(dbName)) {
//        return influx.createDatabase(dbName);
//      } else {
//	operation.retry()
//      }
//    })
//    .catch(err => {
//      operation.retry()
//    })
//})

// TODO: Define schema for driver and passengers
influx.schema('host', {lng: 'float', lat: 'float'})

// TODO: Queue coords write to InfluxDB
const writeCoords = (data) => {
  console.log(`data: ${JSON.stringify(data)}`)

  // map inbound data to schema
  let geolocation = { lng: data.my.lng, lat: data.my.lat }  

  influx.write('host')
    .set('measurement', 'passenger')
    .tag('foo')
    .field(geolocation)
//    .queue()
    .then(() => console.log('log success'))
    .catch(console.error)
}

const queryPassengers = () =>
  influx.query('passenger')
    .where('time > now() -5m')
    .then((data) => {
      // console.log(JSON.stringify(data)); 
      return data
    })
    .catch(console.error)

server.listen(3000, () => {console.log('Listening on 3000')})
