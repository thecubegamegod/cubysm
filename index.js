const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

const fs = require("fs");

app.use(express.static("client"));

let number;
let x = 0;
let pos = [];

let bullets = [];

let mapCountdown = 300;
let currentMap = 0;

let timesUpdated = 0;

let maps = [
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,4,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
  
  [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1],
  [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
  [1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
  [1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
  [1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
  
  ]

map = maps[1];

server.listen(port, function () {
  console.log("🟢 " + port);
});

io.on("connection", function (socket) {
  socket.on("addme", function (arg) {
    if (pos.length - 1 < arg) {
      // xinit = Math.floor(Math.random() * (500 +500) ) -500;
      // yinit = Math.floor(Math.random() * (500 +500) ) -500;
      pos.push({
        name: "fellow",
        hp: 100,
        streak: 0,
        kills: 0,
        deaths: 0,
        xvel: 10000,
        yvel: 10000,
        id: arg,
        dir: "front",
        skin: "cat",
        sub: "hal",
        dead: 1,
        gundir: 0,
        flipgun: 0,
        suicide: 0,
        currentgun: 0,
        socketid: socket.id,
      });
    } else {
      pos[arg].dead = 0;
      pos[arg].hp = 100;
    }
  });
  socket.on("killme", function (arg) {
    // pos[arg][2] = 1
    pos[arg].dead = 1;
    io.to(pos[arg].socketid).emit("playdatgunsfx", "diesfx");
    pos[arg].deaths += 1;
    pos[arg].streak = 0;
    io.sockets.emit("playdatgunsfx", "euhsfx");
  });

  socket.on("gunsfx", function (x) {
    io.sockets.emit("playdatgunsfx", x);
  });

  socket.on("move", function (arg) {
    if (arg.id < pos.length) {
      for (let key in arg) {
        pos[arg.id][key] = arg[key];
      }
    }
  });
  socket.on("bullet", function (arg) {
    bullets.push(arg);
  });
});

setInterval(function myFunction() {
  for (let p = bullets.length - 1; p >= 0; p--) {
    b = bullets[p];

    //MOVING AND COLLIDING BULLETS
    b.ypos += (b.bulletyvel * 90) / 4;
    b.xpos += (b.bulletxvel * 90) / 4;

    for (i = 0; i < pos.length; i++) {
      if (b.id != pos[i].id || b.type == "shrapnel") {
        if (
          b.xpos < pos[i].xvel + 50 &&
          b.xpos > pos[i].xvel - 50 &&
          b.ypos < pos[i].yvel + 50 &&
          b.ypos > pos[i].yvel - 50
        ) {
          const index = bullets.indexOf(b);
          if (index > -1) {
            bullets.splice(index, 1);
          }
          pos[i].hp -= b.dmg;
          pos[i].flash = 100;

          if (pos[i].hp <= 0) {
            if (pos[i].dead == 0) {
              io.sockets.emit("playdatgunsfx", "euhsfx");
              pos[b.id].streak += 1;
              pos[b.id].kills += 1;

              if (pos[b.id].hp + 20 <= 100) {
                pos[b.id].hp += 20;
              }
              pos[i].deaths += 1;

              // fs.appendFile(
              //   "kills.txt",
              //   (pos[b.id].skin)+"k", (err) => err && console.error(err)
              // );
              // fs.appendFile(
              //   "kills.txt",
              //   pos[i].skin+"d", (err) => err && console.error(err)
              // );
            }
            pos[i].dead = 1;
            io.to(pos[i].socketid).emit("playdatgunsfx", "diesfx");
            pos[i].streak = 0;
          } else {
            let rand = Math.round(Math.floor(Math.random() * 2));
            if (rand == 0) {
              io.sockets.emit("playdatgunsfx", "ahsfx");
            }
            if (rand == 1) {
              io.sockets.emit("playdatgunsfx", "owsfx");
            }
          }
        }
      }
    }

    for (i = 0; i < 40; i++) {
      for (j = 0; j < 40; j++) {
        if (map[j][i] == 1) {
          // console.log("map: "+ String((i * 100) - 2000))
          // console.log("player: "+myposx)

          if (
            b.xpos + b.bulletxvel * 90 * 0.25 >= i * 100 - 2000 &&
            b.xpos + b.bulletxvel * 90 * 0.25 <= i * 100 - 2000 + 100 &&
            j * 100 - 2000 <= b.ypos &&
            j * 100 - 2000 + 100 >= b.ypos &&
            b.bulletxvel != 0
          ) {
            const index = bullets.indexOf(b);
            if (index > -1) {
              bullets.splice(index, 1);
            }
          }

          if (
            b.ypos + b.bulletyvel * 90 * 0.25 >= j * 100 - 2000 &&
            b.ypos + b.bulletyvel * 90 * 0.25 <= j * 100 - 2000 + 100 &&
            i * 100 - 2000 <= b.xpos &&
            i * 100 - 2000 + 100 >= b.xpos &&
            b.bulletyvel != 0
          ) {
            const index = bullets.indexOf(b);
            if (index > -1) {
              bullets.splice(index, 1);
            }
          }
        }
      }
    }

    if (b.xpos < -2000 || b.xpos > 2000 || b.ypos < -2000 || b.ypos > 2000) {
      const index = bullets.indexOf(b);
      if (index > -1) {
        bullets.splice(index, 1);
      }
    }
  }
}, 1000 / 240);

setInterval(function myFunction() {
  for (i = 0; i < pos.length; i++) {
    if (pos[i].flash > 0) {
      pos[i].flash -= 15;
    }
  }
  for (let p = bullets.length - 1; p >= 0; p--) {
    b = bullets[p];
    b.bulletyvel *= b.dropoff;
    b.bulletxvel *= b.dropoff;

    if (b.type == "shrapnel" || b.type == "grenade") {
      if (Math.abs(b.bulletxvel) + Math.abs(b.bulletyvel) <= 0.01) {
        const index = bullets.indexOf(b);
        if (index > -1) {
          bullets.splice(index, 1);
        }
      }
    } else if (b.type == "gun") {
      if (Math.abs(b.bulletxvel) + Math.abs(b.bulletyvel) <= 0.1) {
        const index = bullets.indexOf(b);
        if (index > -1) {
          bullets.splice(index, 1);
        }
      }
    } else if (b.type == "knife") {
      if (Math.abs(b.bulletxvel) + Math.abs(b.bulletyvel) <= 0.3) {
        const index = bullets.indexOf(b);
        if (index > -1) {
          bullets.splice(index, 1);
        }
      }
    }
  }
  io.sockets.emit("updatepositions", pos);
  io.sockets.emit("updatebullets", bullets);
}, 1000 / 60);

setInterval(function myFunction() {
  if (mapCountdown > 0) {
    mapCountdown -= 1;
  } else {
    if (currentMap == 0) {
      currentMap = 1;
    } else if (currentMap == 1) {
      currentMap = 0;
    }
    mapCountdown = 300;
    io.sockets.emit("changemap", currentMap);
  }
  io.sockets.emit("timeleft", mapCountdown);
}, 1000);

// HEALTH REGEN
// setInterval(function myFunction(){
//   for (i=0; i<pos.length; i++) {
//     if (pos[i].hp < 100) {
//       pos[i].hp += 1
//     }
//   }
// }, 1000);
