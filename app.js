const express = require("express");
const app = express();

const socketIo = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

const userids = [];
const usernames = [];

io.on("connection", function (socket) {
  socket.on("message", function (message) {
    let index = userids.indexOf(socket.id);
    let name = usernames[index];
    io.emit("message", { message, name, id: socket.id });
  });

  socket.on("nameset", function (namevalue) {
    userids.push(socket.id);
    usernames.push(namevalue);

    io.emit("countofpeople", usernames.length);
    socket.emit("namesetdone");
  });
  socket.on("typing",function(){
    let idx = userids.indexOf(socket.id)
    let name = usernames[idx]
    socket.broadcast.emit(name);
  })

  socket.on("disconnect", function () {
    let index = userids.indexOf(socket.id);
    if (index !== -1) {
      userids.splice(index, 1);
      usernames.splice(index, 1);
      io.emit("countofpeople", usernames.length);
    }
  });
});

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("chat1");
});

server.listen(3000);
