const chai = require('chai')
const redisClient = require('../../src/clients/redisClient')

describe('redisClient', () => {
  describe('#create', () => {
    it('Create addressBook', () => {
      let key = 'key1'
      let vallues = {'key1':'value1'}
      redisClient.create(key, values)

    })
  })
})
