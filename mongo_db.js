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

const registerUser = (data, callback) => {
  const { username, password } = data
  const collection = db.collection('users')

  collection.findOne({ username }, (err, res) => {
    assert.equal(err, null)
    if (res == null) {
      collection.insert({
        username,
        password,
        sprite: 4,
        map: 'rm_map_home',
        x: 320,
        y: 320,
      }, (err, res) => {
        assert.equal(err, null)
        callback('success')
      })
    } else {
      callback("User exists")
    }
  })
}

const loginUser = (data, callback) => {
  const { username, password, socketID } = data
  const collection = db.collection('users')
  
  collection.findOne({ username }, (err, user) => {
    if (!err && user) {
      if (user.password = password) {
        collection.update({ username }, { $set: {socketID} })
        return callback(true, user)
      }
    }
    callback(false, null)
  })
}

const updatePlayerPosition = (data, callback) => {
  const { name, x, y, sprite } = data
  const collection = db.collection('users')

  collection.update({ username: name }, { $set: {
    x: x,
    y: y,
    sprite: sprite,
  }}, (err, res) => {
    assert.equal(err, null)
    callback(data)
  })
}

const getUsername = (socketID, callback) => {
  const collection = db.collection('users')

  collection.findOne({ socketID }, (err, res) => {
    assert.equal(err, null)
    if (res == null) callback('Unregistered user')
    else callback(res.username)
  })
}

module.exports = {
  db,
  fetchMessages,
  insertMessage,
  registerUser,
  loginUser,
  getUsername,
  updatePlayerPosition,
}