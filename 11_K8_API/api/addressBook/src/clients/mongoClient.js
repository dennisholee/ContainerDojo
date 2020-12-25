const MongoClient = require('mongodb').MongoClient

const MONGOHOST = process.env.MONGOHOST || 'localhost'
const MONGOPORT = process.env.MONGOPORT || 27017
const DBNAME    = process.env.DBNAME || 'MYAPP'

const url = `mongodb://${MONGOHOST}:${MONGOPORT}`


exports.create = async (type, obj) => {
  let client = await MongoClient.connect(url)
  console.log("Connected successfully to server");
 
  try {
  let db = client.db(DBNAME);
  
  let addressBook = {'firstname': obj.firstname, 'lastname': obj.lastname}

  let collection = db.collection(type)
  let result = await collection.insertOne(addressBook)

 // await db.close()


  return result
  } catch(e) {
    console.log("*******\n\n" + e)
    return {"status": "error"}
  }
}

