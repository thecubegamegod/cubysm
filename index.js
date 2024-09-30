
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


server.listen(port, function() { console.log("🟢 " + port); });


function update_dic(a,b){
  for(key in b){
    a[key] = b[key]
  }
	return a;
}


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
      // pos[arg.id][0]=arg.xvel
      // pos[arg.id][1]=arg.yvel
      // pos[arg.id][4]=arg.dir
      // pos[arg.id][5]=arg.gundir
      // pos[arg.id][6]=arg.flipgun
      // pos[arg.id][7]=arg.suicide
      // pos[arg.id][8]=arg.xpos
      // pos[arg.id][9]=arg.ypos
      // pos[arg.id][10]=arg.currentgun
      for (let key in arg) {
        pos[arg.id][key] = arg[key]
      }
    }
  });
  socket.on("bullet", function(arg) {
    bullets.push({dmg:arg.dmg, xpos: arg.xpos, ypos: arg.ypos, bulletxvel: arg.bulletxvel, bulletyvel: arg.bulletyvel, id: arg.id })
  });
});



setInterval(function myFunction(){
  io.sockets.emit("updatepositions", pos);
  io.sockets.emit("updatebullets", bullets);
  
  for (let b of bullets) {
    b.ypos += b.bulletyvel*90
    b.xpos += b.bulletxvel*90
    for (i=0; i<pos.length; i++) {
      // if (b.id != pos[i][3]) {
      if (b.id != pos[i].id) {
        // if ((b.xpos < pos[i][0] + 50) && (b.xpos > pos[i][0] - 50) && (b.ypos < pos[i][1] + 50) && (b.ypos > pos[i][1] - 50)) {
        if ((b.xpos < pos[i].xvel + 50) && (b.xpos > pos[i].xvel - 50) && (b.ypos < pos[i].yvel + 50) && (b.ypos > pos[i].yvel - 50)) {
          // pos[i][2] = 1
          const index = bullets.indexOf(b);
          if (index > -1) {
            bullets.splice(index, 1);
          }
          pos[i].hp-=b.dmg
          pos[i].flash = 1
          setTimeout(function myFunction(){
            if (pos.length-1 >= i) {
              pos[i].flash = 0
            }
          }, 100);

          if (pos[i].hp<=0) {
            if (pos[i].dead == 0) {
              pos[b.id].streak += 1
              pos[b.id].kills += 1
              pos[i].deaths += 1
            }
            pos[i].dead = 1
            pos[i].streak = 0
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
