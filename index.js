const app = require("express");
const http = require("http").Server(app);
const io = require("socket.io")(http);

const LOGIN_READY = "LOGIN_READY"
const GREETING = "GREETING"
const REGISTER_ATTEMPT = "REGISTER_ATTEMPT"
const REGISTER_SUCCESS = "REGISTER_SUCCESS"
const REGISTER_FAIL = "REGISTER_FAIL"
const LOGIN_ATTEMPT = "LOGIN_ATTEMPT"
const LOGIN_FAIL = "LOGIN_FAIL"
const LOGIN_SUCCESS = "LOGIN_GOOD"

var {
  db,
  fetchMessages,
  insertMessage,
  registerUser,
  loginUser,
} = require('./mongo_db.js')

var PORT = 3000


// Socket Server
io.on("connection", (socket) => {
  console.log("A user connected.");
  socket.on(GREETING, (data) => {
    socket.emit("LOGIN_READY", data);
  });

  socket.on(REGISTER_ATTEMPT, data => {
    var parsed = JSON.parse(data)
    const { username, password } = parsed
    // Attempt to create this user in Mongodb
    registerUser(parsed, (res)=> {
      if (res === "success") {
        socket.emit(REGISTER_SUCCESS)
        console.log(REGISTER_SUCCESS)
      } else {
        socket.emit(REGISTER_FAIL)
        console.log(REGISTER_FAIL)
      }
    })
  })

  socket.on(LOGIN_ATTEMPT, data => {
    var parsed = JSON.parse(data)
    const { username, password } = parsed
    // @TODO: Attempt to log this user in
    loginUser(parsed, (success, user) => {
      if (success) {
        socket.emit(LOGIN_SUCCESS, JSON.stringify(user))
      } else {
        socket.emit(LOGIN_FAIL)
      }
    })
  })

  socket.on('disconnect', () => {
    console.log(`A user left: ${socket.id}`)
  })
});

// This will make the server start listening for connections
// Here, you need to specifya port. I'm using 3000, but you can use whateveryou want
http.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});