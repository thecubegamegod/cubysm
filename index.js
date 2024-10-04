
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
let x=0
let pos = []

let bullets = []

let timesUpdated = 0


server.listen(port, function() { console.log("🟢 " + port); });

io.on("connection", function(socket) {
  socket.on("addme", function(arg) {
    if (pos.length-1 < arg) {
      // xinit = Math.floor(Math.random() * (500 +500) ) -500;
      // yinit = Math.floor(Math.random() * (500 +500) ) -500;
      pos.push({name: "fellow", hp:100, streak:0, kills:0, deaths:0, xvel: 0, yvel: 0, id: arg, dir:"front", skin:"cat", dead:1, gundir: 0, flipgun: 0, suicide:0, currentgun:0, socketid: socket.id})
    }
    else {
      pos[arg].dead = 0
      pos[arg].hp = 100
    }
  });
  socket.on("killme", function(arg) {
    // pos[arg][2] = 1
    pos[arg].dead = 1
    pos[arg].deaths += 1
    pos[arg].streak = 0
  });


  socket.on("gunsfx", function(x) {
    io.sockets.emit("playdatgunsfx", x)
  });

  socket.on("move", function(arg) {
    if (arg.id<pos.length) {
      for (let key in arg) {
        pos[arg.id][key] = arg[key]
      }
    }
  });
  socket.on("bullet", function(arg) {
    bullets.push(arg)
  });
});



setInterval(function myFunction(){
  for (i=0; i<pos.length; i++) {
    if (pos[i].flash > 0) {
      pos[i].flash -= 15
    }
  }

  io.sockets.emit("updatepositions", pos);
  io.sockets.emit("updatebullets", bullets);
  
  for (let b of bullets) {
//MOVING AND COLLIDING BULLETS
    b.ypos += b.bulletyvel*90
    b.xpos += b.bulletxvel*90
    for (i=0; i<pos.length; i++) {
      if (b.id != pos[i].id) {
        if ((b.xpos < pos[i].xvel + 50) && (b.xpos > pos[i].xvel - 50) && (b.ypos < pos[i].yvel + 50) && (b.ypos > pos[i].yvel - 50)) {
          const index = bullets.indexOf(b);
          if (index > -1) {
            bullets.splice(index, 1);
          }
          pos[i].hp-=b.dmg
          pos[i].flash = 100

          if (pos[i].hp<=0) {
            if (pos[i].dead == 0) {
              io.sockets.emit("playdatgunsfx", "euhsfx")
              pos[b.id].streak += 1
              pos[b.id].kills += 1
              
              if (pos[b.id].hp + 20 <= 100) {
                pos[b.id].hp += 20
              }
              pos[i].deaths += 1

              fs.appendFile(
                "kills.txt",
                (pos[b.id].skin)+"k", (err) => err && console.error(err)
              );
              fs.appendFile(
                "kills.txt",
                pos[i].skin+"d", (err) => err && console.error(err)
              );

            }
            pos[i].dead = 1
            pos[i].streak = 0
          }
          else {
            let rand = Math.round(Math.floor(Math.random() * 2))
            if (rand==0) {
              io.sockets.emit("playdatgunsfx", "ahsfx")
            }
            if (rand==1) {
              io.sockets.emit("playdatgunsfx", "owsfx")
            }
          }
        }
      }
    }
    if (b.xpos<-1000 || b.xpos>1000|| b.ypos<-1000 || b.ypos>1000) {
      const index = bullets.indexOf(b);
      if (index > -1) {
        bullets.splice(index, 1);
      }
    }
    b.bulletyvel*=0.9
    b.bulletxvel*=0.9
    if (Math.abs(b.bulletxvel)+Math.abs(b.bulletyvel)<=0.1) {
      const index = bullets.indexOf(b);
      if (index > -1) {
        bullets.splice(index, 1);
      }
    }
  }
  
}, 1000/60);


// HEALTH REGEN
// setInterval(function myFunction(){
//   for (i=0; i<pos.length; i++) {
//     if (pos[i].hp < 100) {
//       pos[i].hp += 1
//     }
//   }
// }, 1000);
