const express = require('express')
const http = require('http')
//const socket = require('socket.io')
//const randomLocation = require('random-location')
//const InfluxDB = require('influxdb-nodejs')
//const retry = require('retry')
//const R = require('ramda')

const app = express()
const server = http.Server(app)
//const io = socket(server)

//lang & long 
function getPassengerCoord(phoneNum){
  http.get('01_simpleapp:3000/api/passengers/'+phoneNum, (resp) => {
    return resp;
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  
}

//
function getDriverInfo(phoneNum){
  http.get('http://34.92.144.247:5000/user/'+phoneNum, (resp) => {
    var out=[];

    temp = getPassengerCoord(phoneNum);
    out[0]= {
      phone: phoneNum,
      lat: temp.param.lat,
      lng: temp.param.lng
    };

    temp = getPassengerCoord(resp.param.pass1);
    out.push({
      phone: phoneNum,
      lat: temp.param.lat,
      lng: temp.param.lng
    });

    temp = getPassengerCoord(resp.param.pass2);
    out.push({
      phone: phoneNum,
      lat: temp.param.lat,
      lng: temp.param.lng
    });

    temp = getPassengerCoord(resp.param.pass3);
    out.push({
      phone: phoneNum,
      lat: temp.param.lat,
      lng: temp.param.lng
    });

    temp = getPassengerCoord(resp.param.pass4);
    out.push({
      phone: phoneNum,
      lat: temp.param.lat,
      lng: temp.param.lng
    });

    temp = getPassengerCoord(resp.param.pass5);
    out.push({
      phone: phoneNum,
      lat: temp.param.lat,
      lng: temp.param.lng
    });

    temp = getPassengerCoord(resp.param.pass6);
    out.push({
      phone: phoneNum,
      lat: temp.param.lat,
      lng: temp.param.lng
    });

    return out;
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

//app.set('view engine', 'ejs')

//========================================================================== api

const api = express.Router()

api.get('/waypoints/:phoneNum', async (req,res) => {
  const getWayPointsP = new Promise((resolve, reject) => {
    resolve(getDriverInfo(req.param.phoneNum))
    // do something asynchronous which eventually calls either:
    //
    //   resolve(someValue); // fulfilled
    // or
    //   reject("failure reason"); // rejected
  }).then(result => {
    return result;
  });


})
app.use('/api', api)

//===============================================================
/*
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

//======================================================================= routes

app.get('/map', (req, res) => {
  res.status(200).render('home')
})

//==================================================================== socket io

io.on('connection', function (socket) {
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


// TODO: Define schema for driver and passengers
influx.schema('host', {lng: 'float', lat: 'float'})

// TODO: Queue coords write to InfluxDB
const writeCoords = (data) => {
  console.log(`write data: ${JSON.stringify(data)}`)

  // map inbound data to schema
  let geolocation = { lng: data.my.lng, lat: data.my.lat }  

  influx.write('host')
    .set('measurement', 'passenger')
    .tag({name:data.my.usr})
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
      // console.log(JSON.stringify(data)); 
      return data
    })
    .catch(console.error)
*/
server.listen(3000, () => {console.log('Listening on 3000')})
