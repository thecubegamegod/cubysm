
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(express.static("client"));

let number;
let x=0
let pos = []

let bullets = []

let timesUpdated = 0

setInterval(function (){
  io.sockets.emit("updatepositions", pos);
}, 1000/60)



setInterval(function myFunction(){
  for (let b of bullets) {
    b.ypos += b.bulletyvel*50
    b.xpos += b.bulletxvel*50
    for (i=0; i<pos.length; i++) {
      if (b.id != pos[i][3]) {
        if ((b.xpos < pos[i][0] + 50) && (b.xpos > pos[i][0] - 50) && (b.ypos < pos[i][1] + 50) && (b.ypos > pos[i][1] - 50)) {
          pos[i][2] = 1
        }
      }
    }
    if (b.xpos<-1000 || b.xpos>1000|| b.ypos<-1000 || b.ypos>1000) {
      const index = bullets.indexOf(b);
      if (index > -1) {
        bullets.splice(index, 1);
      }
    }
    b.bulletyvel/=1.1
    b.bulletxvel/=1.1
    if (Math.abs(b.bulletxvel)+Math.abs(b.bulletyvel)<=0.1) {
      const index = bullets.indexOf(b);
      if (index > -1) {
        bullets.splice(index, 1);
      }
    }
  }
  
}, 1000/60);

server.listen(port, function() { console.log("🟢 " + port); });

io.on("connection", function(socket) {
  socket.on("addme", function(arg) {
    if (pos.length-1 < arg) {
      // xinit = Math.floor(Math.random() * (500 +500) ) -500;
      // yinit = Math.floor(Math.random() * (500 +500) ) -500;
      pos.push([0,0,0,arg,0,0,0,0])
    }
  });
  socket.on("killme", function(arg) {
    pos[arg][2] = 1
  });
  socket.on("move", function(arg) {
    if (arg.id<pos.length) {
      pos[arg.id][0]=arg.xvel
      pos[arg.id][1]=arg.yvel
      pos[arg.id][4]=arg.dir
      pos[arg.id][5]=arg.gundir
      pos[arg.id][6]=arg.flipgun
      pos[arg.id][7]=arg.suicide
      pos[arg.id][8]=arg.xpos
      pos[arg.id][9]=arg.ypos
    }
  });
  socket.on("bullet", function(arg) {
    bullets.push({xpos: arg.xpos, ypos: arg.ypos, bulletxvel: arg.bulletxvel, bulletyvel: arg.bulletyvel, id: arg.id })
    io.sockets.emit("updatebullets", {xpos: arg.xpos, ypos: arg.ypos, bulletxvel: arg.bulletxvel, bulletyvel: arg.bulletyvel, id: arg.id });
  });
});

