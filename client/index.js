const socket = io()

let id = 99
let len = 0
let positions = []

let myposx = 0
let myposy = 0

let xvel = 0
let yvel = 0

let chance = 2

let aksfx
let glocksfx


let skin = "cat"

let weapons =  [
  { name: "ak", speed: 6, auto: true, spread:0.3, recoil:4, spriterecoil: 0.2, bulletspd: 1, xoffset:10, yoffset:20},
  { name: "glock", speed: 12, auto: false, spread:0, recoil:0, spriterecoil: 0.5, bulletspd: 0.8, xoffset:0, yoffset:0}
]

let delay = 0

let bullets = []
let localbullets = []

let img;
let bricks
let cubefront;

let bulletimage;

let direction = "front"
let mydirection = 0


let weaponrotation = 0
let suicide = 0
let flipgun = 0

let death
let cursor

let recoilx = 0
let recoily = 0

let currentgun = 0

function preload() {
  img = loadImage('bg.png');
  cubefrontleft = loadImage('cubepixel2.png');
  bricks = loadImage('brick.png');
  cubefrontright = loadImage('cubepixel1.png');
  cuberight = loadImage('cubepixel9.png');
  cubeleft = loadImage('cubepixel9.png');
  cubefront = loadImage('cubepixel3.png');
  cubeback = loadImage('cubepixel4.png');
  cubebackleft = loadImage('cubepixel5.png');
  cubebackright = loadImage('cubepixel6.png');

  bulletimage = loadImage('bullet.png');
  cursor = loadImage('crosshair.png')
  ak = loadImage('ak.png')
  akgone = loadImage('ak.png')
  death = loadImage('death.png')
  glock = loadImage('pistol.png')
  glockgone = loadImage('pistolgone.png')

  catfrontleft = loadImage('catfront3.png');
  catfrontright = loadImage('catfront1.png');
  catfront = loadImage('catfront2.png');
  catback = loadImage('catfront5.png');
  catbackleft = loadImage('catfront4.png');
  catbackright = loadImage('catfront6.png');
  
}
function setup() {
  frameRate(240)
  aksfx = loadSound('ak.mp3');
  glocksfx = loadSound('glock.mp3');
  
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity(1);
  noSmooth()
  document.addEventListener('contextmenu', event => event.preventDefault());
  
  socket.emit("addme", id);
  noCursor();
  myposx = Math.floor(Math.random() * (1000 + 1000)) + -1000;
  myposy = Math.floor(Math.random() * (1000 + 1000)) + -1000;
}

socket.on("updatebullets", function(x) {
  bullets=(x)
})

function mousePressed() {
  if (mouseButton === LEFT) {
    shoot()
  }
}


function keyPressed() {
  if (key === 'p') {
    if (skin=="cube"){
      skin = "cat"
    }
    else {
      skin = "cube"
    }
  }
}


function shoot() {
  if (delay>=weapons[currentgun].speed || weapons[currentgun].auto == false) {
    // if (positions[id][2]==0) {
    if (positions[id].dead==0) {
      xdiff = (mouseX - width/2)
      ydiff = (mouseY - height/2)

      if (keyIsDown(SHIFT)) {
        bulletxvel = - ((xdiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff))) + (Math.random()-0.5)*weapons[currentgun].spread) * weapons[currentgun].bulletspd
        bulletyvel = - ((ydiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff))) + (Math.random()-0.5)*weapons[currentgun].spread) * weapons[currentgun].bulletspd
        socket.emit("killme", id);
      }
      else {
        bulletxvel = (xdiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)) + (Math.random()-0.5)*weapons[currentgun].spread) * weapons[currentgun].bulletspd
        bulletyvel = (ydiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)) + (Math.random()-0.5)*weapons[currentgun].spread) * weapons[currentgun].bulletspd
      }

      // endofgunx = myposx + bulletxvel/(abs(bulletxvel)+abs(bulletyvel))*300
      // endofguny = myposy + bulletyvel/(abs(bulletxvel)+abs(bulletyvel))*300

      newBullet = { xpos: myposx, ypos: myposy, bulletxvel: bulletxvel, bulletyvel: bulletyvel, id: id}
      socket.emit("bullet", newBullet);
      localbullets.push(newBullet)
    }
    delay = 0
    socket.emit("gunsfx", weapons[currentgun].name + "sfx")
  }
  recoilx = -bulletxvel*weapons[currentgun].recoil
  recoily = -bulletyvel*weapons[currentgun].recoil
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){
  let dead = 1

  if (id != 99 && positions.length>id) {
    if (positions[id].dead == 0) { dead = 0 }
  }

  
  xvel = 0
  yvel = 0

  if (keyIsDown(68) === true) { xvel += 10 }
  if (keyIsDown(65) === true) { xvel -= 10 }
  if (keyIsDown(87) === true) { yvel -= 10 }
  if (keyIsDown(83) === true) { yvel += 10 }
  if (dead == 1) {
    if (keyIsDown(32) === true) { window.location.reload() }
  }

  if ((Math.abs(xvel) != 0) && (Math.abs(yvel) != 0)) {
    xvel *= 0.707
    yvel *= 0.707
  }

  xvel += recoilx
  recoilx = 0
  yvel += recoily
  recoily = 0

  // if (xvel != 0 || yvel != 0) {
    if (direction==cubefront) { mydirection = 0 }
    if (direction==cubefrontleft) { mydirection = 1 }
    if (direction==cubefrontright) { mydirection = 2 }
    if (direction==cubeback) { mydirection = 10 }
    if (direction==cubebackleft) { mydirection = 11 }
    if (direction==cubebackright) { mydirection = 12 }
    myposx += xvel
    myposy += yvel
    myposx = constrain(myposx, -1000, 1000)
    myposy = constrain(myposy, -1000, 1000)
  // }


  xoffset = (width/2)-myposx-(mouseX - windowWidth/2)/3
  yoffset = (height/2)-myposy-(mouseY - windowHeight/2)/3
  background('white');



  image(img, xoffset, yoffset, 2000, 2000);

  // imageMode(CORNER)
  // for (i=-1000; i<1000; i+=400) {
  //   for (j=-1000; j<1000; j+=400) {
  //     image(bricks, xoffset+i, yoffset+j,400,400);
  //   }
  // }
  // imageMode(CENTER)


  for (let b of localbullets) {
    b.ypos += b.bulletyvel*90
    b.xpos += b.bulletxvel*90
    if (b.xpos<-1000 || b.xpos>1000|| b.ypos<-1000 || b.ypos>1000) {
      localbullets.splice(b, 1);
    }
    b.bulletyvel*=0.9
    b.bulletxvel*=0.9
    if (Math.abs(b.bulletxvel)+Math.abs(b.bulletyvel)<=0.1) {
      localbullets.splice(b, 1);
    }
    image(bulletimage, b.xpos + xoffset, b.ypos+yoffset)
  }

  for (let b of bullets) {
    imageMode(CENTER)
    if (b.id!=id) {
      image(bulletimage, b.xpos + xoffset, b.ypos+yoffset)
    }
  }
  if (dead == 0) {
    push()
    translate(xoffset+myposx, yoffset+myposy)
    rotate(Math.atan2(mouseY-(height/2), mouseX-(width/2)))
    translate(75,0)
    suicide = 0
    if(mouseX-(width/2)>=0){
      flipgun = 1
      scale(-1, 1);
    }
    else {
      flipgun = 0
      scale(-1, -1);
    }
    if (keyIsDown(SHIFT)) {
      suicide = 1
      scale(-1, 1);
    }


    if (delay>=weapons[currentgun].speed) {
      image(eval(weapons[currentgun].name), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
    }
    else {
      rotate(weapons[currentgun].spriterecoil/delay)
      image(eval(weapons[currentgun].name+"gone"), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
    }

    pop()
    weaponrotation = Math.atan2(mouseY-(height/2), mouseX-(width/2))
  }

  for (i=0; i<len; i++) {
    if (i!=id) {
      if (positions[i].dead==0) {

        image(eval(positions[i].skin+positions[i].dir), positions[i].xvel+xoffset, positions[i].yvel+yoffset)
        fill('white')

        push()
        translate(positions[i].xvel+xoffset, positions[i].yvel+yoffset)
        rotate(positions[i].gundir)
        translate(75,0)
        if(positions[i].flipgun==1){ scale(-1, 1); }
        else { scale(-1, -1); }
        if (positions[i].suicide==1) { scale(-1, 1); }
        
        image(eval(weapons[positions[i].currentgun].name), 0, 0)

        pop()
        
      }
    }
    else {
      if (i<len) {
        if (positions[id].dead == 0) {
          imageMode(CENTER)
          direction = "front"
          angle = Math.atan2(mouseY-(height/2), mouseX-(width/2))

          if (angle > 1.963) { direction = "frontleft" }
          else if (angle > 1.178) { direction = "front" }
          else if (angle > 0.393) { direction = "frontright" }
          else if (angle > -1.178) { direction = "backright" }
          else if (angle > -1.963) { direction = "back" }
          else { direction = "backleft" }

          image(eval(skin+direction), xoffset+myposx, yoffset+myposy);
        }
      }
    }
  }

  if (dead == 1) {
    fill('white')
    image(death,0,0,10000,10000)
    textAlign(CENTER);
    if (chance==2) {
      chance = Math.random();
    }
    if (chance>=0.9) {
      text("Stroke. He couldn't move. He went cold. And just stopped moving. 🤯", width/2, height/2)
    }
    else {
      text('SPACE to respawn', width/2, height/2)
    }
  }
  image(cursor, mouseX, mouseY) 

  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(0), 10, height - 10);
}

function mouseWheel(event) {
  if (event.delta > 0) {
    if (currentgun > 0) {
      currentgun-=1
    }
    else {
      currentgun=Object.keys(weapons).length-1
    }
  } else {
    if (currentgun < Object.keys(weapons).length-1) {
      currentgun+=1
    }
    else {
      currentgun=0
    }
  }
  return false;
}


setInterval(function myFunction(){
  socket.volatile.emit("move", { xvel: myposx, yvel: myposy, id: id, dir: direction, gundir: weaponrotation, flipgun: flipgun, suicide:suicide, currentgun: currentgun, skin: skin});
  if (delay<weapons[currentgun].speed) {
    delay+=1
  };
  if (weapons[currentgun].auto == true && mouseIsPressed && mouseButton == LEFT) {
    shoot()
  }
}, 1000/60);

socket.on("updatepositions", function(x) {
  if (id == 99) {
    id = x.length
    len += 1
  }
  len = x.length
  positions = x
})

socket.on("playdatgunsfx", function(y) {
  eval(y).play()
})
