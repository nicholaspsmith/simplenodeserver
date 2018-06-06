var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

const url = 'mongodb://localhost:27017'
const dbName = 'mmodb'
let db = null

MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  assert.equal(err, null)
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

const registerTemporaryUser = (data, callback) => {
  const { sessionID, socketID } = data
  const collection = db.collection('users')

  collection.findOne({ sessionID }, (err, res) => {
    assert.equal(err, null)
    if (res == null) {
      collection.insert({
        sessionID,
        socketID,
      })
    }
    callback()
  })
}

const removeUserBySocketID = (id, callback) => {
  const collection = db.collection('users')
  collection.remove({ socketID: id }, (err, res) => {
    assert.equal(err, null)
    callback(res)
  })
}

const updatePlayerPosition = (data, callback) => {
  const {
    sessionID,
    socketID,
    x,
    y,
    sprite_index,
    room,
  } = data
  const collection = db.collection('users')

  collection.update({ sessionID: sessionID }, { $set: {
    socketID: socketID,
    x: x,
    y: y,
    sprite_index: sprite_index,
    room: room,
  }}, (err, res) => {
    assert.equal(err, null)
    callback(data)
  })
}



module.exports = {
  db,
  fetchMessages,
  insertMessage,
  updatePlayerPosition,
  registerTemporaryUser,
  removeUserBySocketID,
}