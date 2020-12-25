require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const express      = require('express')
const bodyParser   = require('body-parser')
const cors         = require('cors')
const redis        = require('redis')
const oasTools     = require('oas-tools')
const jsyaml       = require('js-yaml')
const fs           = require('fs')
const path         = require('path')
const http         = require('http')

const PORT = process.env.PORT || 80

const app = express()
app.use(cors())
app.use(bodyParser.json())

var spec   = fs.readFileSync(path.join('./src/spec/contacts.yaml'), 'utf8')
var oasDoc = jsyaml.safeLoad(spec)

var options_object = {
  controllers: path.join(__dirname, './src/controllers'),
  strict: true,
  router: true,
  validator: true,
  docs: {
    apiDocs: '/api-docs',
    apiDocsPrefix: '',
    swaggerUi: '/docs',
    swaggerUiPrefix: ''
  },
  ignoreUnknownFormats: true
}

oasTools.configure(options_object)

oasTools.initialize(oasDoc, app, function() {
  http.createServer(app).listen(PORT, function() {
    console.log("App up and running!")
  })
})

