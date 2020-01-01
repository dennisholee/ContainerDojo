const express = require('express')
const http = require('http')
const socket = require('socket.io')
const randomLocation = require('random-location')
const InfluxDB = require('influxdb-nodejs')
const retry = require('retry')
const R = require('ramda')
const bodyParser = require('body-parser');
const app = express()
const server = http.Server(app)
const io = socket(server)

app.set('view engine', 'ejs')

//========================================================================== api

const api = express.Router()

// Get passenger coordinates
// TODO: Differentiate passengers ... by "Group By"?
api.get('/passengers', async (req, res) => {
  let resultset = await queryPassengers()
  let passengers = resultset.passenger

  if(!R.isEmpty(passengers)) {
    console.log(`resultset: ${JSON.stringify(passengers)}`)
    res.status(200).send(passengers)
  } else {
    res.status(200).send({})
  }
})

app.use('/api', api)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//======================================================================= routes

app.get('/map', (req, res) => {
  console.log('get map');
  res.status(200).render('home')
})

//==================================================================== socket io

//=========== get lat/lng by phone ====

api.get('/passengers/:phone', async(req, res) => {
  let resultset = await queryPassengersByPhone(req.params.phone)
  let passenger = {
    lat: resultset.passenger[0].lat,
    lng: resultset.passenger[0].lng
  }

  if(!R.isEmpty(passenger)) {
    console.log(`resultset for query passenger: ${JSON.stringify(passenger)}`)
    res.status(200).send(passenger)
  } else {
    console.log('Unable to query passenger by phone number')
    res.status(200).send({})
  }
})

api.post('/coords', function (req, res, next) {
    if (!req.body) {
    	console.log(req);
    	console.log(req.body);
   	console.log(req.params);
    	writeCoords(JSON.parse(req.body));
    	console.log('write coords');
   	res.status(200).send("successful");
    } else {
	console.log("error post");
    }
});
//=====================================


io.on('connection', function (socket) {
  console.log('io on connection');
  socket.emit('news', { hello: 'world' })
  socket.on('origin', writeCoords )
  socket.on('coords', function (data) {
    console.log(JSON.stringify(data));
    queryPassengers()
      .then(resultset => {	
	console.log(`socket.on => resultset: ${JSON.stringify(resultset)}`)
	if(!R.isEmpty(resultset.passenger)) {
          // let record = data.results[0].series[0].values[0]
          // socket.emit('passenger', {latitude: record[1], longitude: record[2]})
	  socket.emit('passenger', resultset.passenger)
        }
      })
      .catch(console.log)

    // socket.emit('passenger', randomHK())
  });
});


//================================================================= geolocations

const hk = { latitude: 22.3964, longitude: 114.1096 }

const randomHK = () => randomLocation.randomCirclePoint(hk, 4000)

//==================================================================== Influx DB

const dbName = "mydb"
const dbHost = 'influxdb-1-influxdb-svc'
const dbPort = '8086'
const uid = "influxdb-admin"
const pw = "sCtTY1L5wh7ehieqnUkQKh3WnsxCqqwP"

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
const influx = new InfluxDB(`http://${uid}:${pw}@${dbHost}:${dbPort}/${dbName}`)

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


// TODO: Define schema for driver and passengers
influx.schema('host', {lng: 'float', lat: 'float'})

// TODO: Queue coords write to InfluxDB
const writeCoords = (data) => {
  console.log(`write data: ${JSON.stringify(data)}`)

  // map inbound data to schema
  let geolocation = { lng: data.my.lng, lat: data.my.lat }  

  influx.write('host')
    .set('measurement', 'passenger')
    .tag({phone:data.my.phone})
    .field(geolocation)
//    .queue()
    .then(() => console.log('log success'))
    .catch(console.error)
}

const queryPassengers = () =>
  influx.query('passenger')
    .set({format:'json'})
    .where('time > now() -1h')
    .then((data) => {
       console.log(JSON.stringify(data)); 
      return data
    })
    .catch(console.error)

const queryPassengersByPhone = (phone) =>
    influx.query('passenger')
      .set({format:'json'})
      .where("phone = '" + phone +"'")
      .then((data) => {
         console.log(JSON.stringify(data)); 
        return data
      })
      .catch(console.error)

server.listen(3000, () => {console.log('Listening on 3000')})
