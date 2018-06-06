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

const getUsername = (socketID, callback) => {
  const collection = db.collection('users')

  collection.findOne({ socketID }, (err, res) => {
    assert.equal(err, null)
    if (res == null) callback('Unregistered user')
    else callback(res.username)
  })
}