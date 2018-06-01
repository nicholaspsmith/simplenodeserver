const app = require("express");
const http = require("http").Server(app);
const io = require("socket.io")(http);
//var { db, fetchMessages, insertMessage } = require('./mongo_db.js')

var PORT = 3000


// Socket Server
io.on("connection", (socket) => {
  console.log("A user connected.");
  socket.on("greeting", (data) => {
    console.log(data)
    socket.emit("reply", "Hello " + data);
  });

  const interval = setInterval(() => {
    const message = `ping @ ${new Date().toLocaleTimeString()}`
    socket.emit("reply", message)
    console.log(message)
  }, 100)

  socket.on('disconnect', () => {
    clearInterval(interval)
    console.log('A user left.')
  })
});

// This will make the server start listening for connections
// Here, you need to specifya port. I'm using 3000, but you can use whateveryou want
http.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});