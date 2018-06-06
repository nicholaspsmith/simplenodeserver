const app = require("express");
const http = require("http").Server(app);
const io = require("socket.io")(http);

const MULTIPLAYER_ENABLED = "MULTIPLAYER_ENABLED"
const GREETING = "GREETING"
const REGISTER_ATTEMPT = "REGISTER_ATTEMPT"
const REGISTER_SUCCESS = "REGISTER_SUCCESS"
const REGISTER_FAIL = "REGISTER_FAIL"
const LOGIN_ATTEMPT = "LOGIN_ATTEMPT"
const LOGIN_FAIL = "LOGIN_FAIL"
const LOGIN_SUCCESS = "LOGIN_GOOD"
const UPDATE_PLAYER_POSITION = "UPDATE_PLAYER_POSITION"
const PLAYER_DID_MOVE = "PLAYER_DID_MOVE"

var {
  db,
  fetchMessages,
  insertMessage,
  updatePlayerPosition,
  registerTemporaryUser,
  removeUserBySocketID,
} = require('./mongo_db.js')

var PORT = 3000


// Socket Server
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on(GREETING, (sessionID) => {
    console.log(`A user identified as: ${sessionID}`);
    const data = { sessionID, socketID: socket.id }
    registerTemporaryUser(data, (res) => {
      socket.emit("MULTIPLAYER_ENABLED", data);
    })
  });

  socket.on(UPDATE_PLAYER_POSITION, data => {
    var parsed = JSON.parse(data)
    parsed.socketID = socket.id
    updatePlayerPosition(parsed, () => {
      // @TODO: inform all sockets of new player position
      socket.broadcast.emit(PLAYER_DID_MOVE, data)
    })
  })

  socket.on('disconnect', () => {
    // remove temporary user from database
    removeUserBySocketID(socket.id, (res) => {
      console.log(`A user left: ${socket.id}`)
    })
  })
});

// This will make the server start listening for connections
// Here, you need to specifya port. I'm using 3000, but you can use whateveryou want
http.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});