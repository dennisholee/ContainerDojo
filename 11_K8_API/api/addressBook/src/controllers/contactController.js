const redisClient = require('../clients/redisClient')
const mongoClient = require('../clients/mongoClient')

const TYPE = "addressBook"

exports.getContact = async (args, res) => {
  let firstname = args.body.firstname
  let lastname  = args.body.lastname

  let contacts =  await redisClient.findByLastname('')//read('contactList')

  res.status(200).send(contacts)
}

exports.createContact = async (args, res) => {
  console.log(`Create request: ${JSON.stringify(args.body)}`)

  const keyfunc = ({firstname, lastname}) => ({firstname, lastname})
  let key = keyfunc(args.body)

  // Create contact in Mongo.
  let {insertedId} = await mongoClient.create(TYPE, key)
  console.log(`insertedId: ${insertedId}`)

  await redisClient.create(TYPE, {'firstname': key.firstname, 'lastname': key.lastname, 'id': insertedId})

  console.log('Data persisted to redis')

  res.status(200).send({'message': 'OK', 'data' : {'firstname': key.firstname, 'lastname': key.lastname, 'id': insertedId}})
}
