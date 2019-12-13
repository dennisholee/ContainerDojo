// https://cloud.google.com/functions/docs/writing/http#writing_http_content-nodejs
//
const InfluxDB = require('influxdb-nodejs')

const dbHost = process.env.DBHOST || 'localhost'
const dbName = process.env.DBNAME || 'mydb'

console.log(`Connecting to http://${dbHost}:8086/${dbName}`)
const influx = new InfluxDB(`http://${dbHost}:8086/${dbName}`)

exports.passengers = (req, res) => {
    influx.query('passengers')
	.set({format:'json'})
	.then(data => {
	    console.log(`Fetch: ${JSON.stringify(data)}`)
            res.status(200).send('OK')
	})
	.catch(e => {
	    console.error(e)
            res.status(500).send('FAIL')
	})
}
