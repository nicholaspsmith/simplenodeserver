var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'mmodb'
let db = null

MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  assert.equal(null, err)
  db = client.db(dbName)
})

const fetchMessages = (callback) => {
  const collection = db.collection('messages')
  collection.find({}).toArray((err, docs) => {
    assert.equal(err, null)
    callback(docs)
  })
}

const insertMessage = (message, callback) => {
  const collection = db.collection('messages')

  collection.insert({ message }, (err, result) => {
    assert.equal(err, null)
    callback(result)
  })
}


module.exports = {
  db,
  fetchMessages,
  insertMessage,
}