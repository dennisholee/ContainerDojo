// https://cloud.google.com/functions/docs/writing/http#writing_http_content-nodejs
//
// const InfluxDB = require('influxdb-nodejs')

// Cloud Function's environment variables will supersede those from dotenv
require('dotenv').config();

const InfluxCrud = require('./influx-crud')

const influxCrud = InfluxCrud('passenger')

exports.passengers = async (req, res) => {
    let data = await influxCrud.findAll()
    res.status(200).send(JSON.stringify(data))
}
