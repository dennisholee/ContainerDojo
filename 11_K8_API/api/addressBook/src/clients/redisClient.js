const redis         = require('redis')
const { promisify } = require('util')
const _             = require('lodash')

const REDISHOST = process.env.REDISHOST || 'localhost'
const REDISPORT = process.env.REDISPORT || 6379

const client        = redis.createClient({'host':REDISHOST, 'port':REDISPORT})
const getAsync      = promisify(client.get).bind(client)
const hmsetAsync    = promisify(client.hmset).bind(client)
const saddAsync     = promisify(client.sadd).bind(client)
const smembersAsync = promisify(client.smembers).bind(client)
const lpushAsync    = promisify(client.lpush).bind(client)
const lrangeAsync   = promisify(client.lrange).bind(client)
const zaddAsync     = promisify(client.zadd).bind(client)
const sortAsync     = promisify(client.sort).bind(client)

client.on('error', err => {
  console.log('Redis Client error ...')
  console.log(err)
})

exports.create = (key, args) => {
  console.log(`Create redis key: ${key}:${args.id}`)
  return Promise.all([
    hmsetAsync(`${key}:${args.id}`, {'firstname':args.firstname, 'lastname':args.lastname}),
    saddAsync(key, `${args.id}`)
  ]).then(i => {
    return 0
  }).catch(e => {
    return 1
  })
}

exports.read = async (key) => {
  let contacts = await lrangeAsync(key, 0, -1)
  let result = contacts.map(item => JSON.parse(item))
  return result
}

exports.findByLastname = async(lastname) => {
  let addressBook = await sortAsync('addressBook','by','addressBook:*->lastname', 'alpha', 'get','#','get','addressBook:*->firstname','get','addressBook:*->lastname')

  let keys = ['id', 'firstname', 'lastname']
  let result = _(addressBook).chunk(keys.length).map(items => _.zipObject(keys, items)).value()
  console.log(`FindByLastname: ${JSON.stringify(result)}`)
  return result
}
