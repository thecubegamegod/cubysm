const socket = io()

let id = 99
let len = 0
let positions = []

let myposx = 0
let myposy = 0

let xvel = 0
let yvel = 0

let reloading = 0


let deathangle = 0

let aksfx
let glocksfx

let skin = "cat"

let weapons =  [
  { name: "ak", reloadspeed: 2.5, ammo:30, maxammo:30, speed: 6, auto: true, spread:0.3, recoil:4, spriterecoil: 0.2, bulletspd: 1, xoffset:10, yoffset:20},
  { name: "glock", reloadspeed: 1.5, ammo:17, maxammo:17, speed: 12, auto: false, spread:0, recoil:6, spriterecoil: 0.5, bulletspd: 0.8, xoffset:0, yoffset:15}
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


let username = "fellow"

let weaponrotation = 0
let suicide = 0
let flipgun = 0

let death
let cursor

let recoilx = 0
let recoily = 0

let currentgun = 0



socket.on("connect_error", (err) => {
  // the reason of the error, for example "xhr poll error"
  console.log(err.message);

  // some additional description, for example the status code of the initial HTTP response
  console.log(err.description);

  // some additional context, for example the XMLHttpRequest object
  console.log(err.context);
});



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
  arrow = loadImage('arrow.png');
  arrowgone = loadImage('arrowempty.png');

  bulletimage = loadImage('bullet.png');
  cursor = loadImage('crosshair.png')
  ak = loadImage('ak.png')
  akgone = loadImage('ak.png')
  death = loadImage('death.png')
  glock = loadImage('pistolold.png')
  glockgone = loadImage('pistolgoneold.png')

  catfrontleft = loadImage('catfront3.png');
  catfrontright = loadImage('catfront1.png');
  catfront = loadImage('catfront2.png');
  catback = loadImage('catfront5.png');
  catbackleft = loadImage('catfront4.png');
  catbackright = loadImage('catfront6.png');
  
}


function respawnMe(){
  socket.emit("addme", id);
  myposx = Math.floor(Math.random() * (1000 + 1000)) + -1000;
  myposy = Math.floor(Math.random() * (1000 + 1000)) + -1000;
  for(i=0; i<weapons.length; i++) {
    weapons[i].ammo = weapons[i].maxammo
  }
}

function setup() {
  aksfx = loadSound('ak.mp3');
  glocksfx = loadSound('glock.mp3');
  
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(60)
  pixelDensity(1);
  noSmooth()
  document.addEventListener('contextmenu', event => event.preventDefault());
  
  noCursor();

  nameField = createInput('')
  nameField.attribute('placeholder', 'username')
  nameField.size(100)
  respawnMe()
}

socket.on("updatebullets", function(x) {
  bullets=(x)
})

function mousePressed() {
  if (positions[id].dead == 0) {
    if (mouseButton === LEFT) {
      shoot()
    }
  }
  else {
    if ((width/2)+150<mouseX && (width/2)+250>mouseX && (height/2)-50<mouseY && mouseY<(height/2)+50) {
      if(skin=="cube") {
        skin = "cat"
      }
      else {
        skin = "cube"
      }
    }
    if ((width/2-150)>mouseX && (width/2-250)<mouseX && (height/2)-50<mouseY && mouseY<(height/2)+50) {
      if(skin=="cube") {
        skin = "cat"
      }
      else {
        skin = "cube"
      }
    }
  }
}


function keyPressed() {
  if ((key === 'p') && (positions[id].dead == 1)) {
    if (skin=="cube"){
      skin = "cat"
    }
    else {
      skin = "cube"
    }
  }
  if (reloading == 0) {
    if (key === '1') {
      currentgun=0
    }
    if (key === '2') {
      currentgun=1
    }
    if (key === 'r') {
      weapons[currentgun].ammo = 0
      reloading = 1
      setTimeout(function myFunction(){
        weapons[currentgun].ammo = weapons[currentgun].maxammo
        reloading = 0
      }, weapons[currentgun].reloadspeed*1000);
    }
  }
}


function shoot() {
  console.log(weapons[currentgun].ammo)
  if (weapons[currentgun].ammo>0) {
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
        weapons[currentgun].ammo-=1
        delay = 0
        socket.emit("gunsfx", weapons[currentgun].name + "sfx")
      }
    }
    recoilx = -bulletxvel*weapons[currentgun].recoil
    recoily = -bulletyvel*weapons[currentgun].recoil
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){
  if (nameField.value()!="") {
    username = nameField.value()
  }
  else {
    username = "fellow"
  }

  let dead = 1

  if (id != 99 && positions.length>id) {
    if (positions[id].dead == 0) { dead = 0 }
  }

  
  xvel = 0
  yvel = 0

  if (dead == 1) {
    if (keyIsDown(32) === true) {
      // window.location.reload()
      respawnMe()
    }
  }
  else {
    if (keyIsDown(68) === true) { xvel += 10 }
    if (keyIsDown(65) === true) { xvel -= 10 }
    if (keyIsDown(87) === true) { yvel -= 10 }
    if (keyIsDown(83) === true) { yvel += 10 }
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



  noStroke()
  // fill('#da0063')
  image(img, width/2, height/2, width+4, height+4);
  image(img, xoffset, yoffset, 2000, 2000);
  // rect(0, 0, width, height);
  // fill('#652cb3')
  // rect(xoffset-1000, yoffset-1000, 2000, 2000);

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
    // nameField.position(-300, 100)
    nameField.position(25, 25)
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


    if (reloading == 0) {
      if (delay>=weapons[currentgun].speed) {
        image(eval(weapons[currentgun].name), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
      }
      else {
        rotate(weapons[currentgun].spriterecoil/delay)
        image(eval(weapons[currentgun].name+"gone"), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
      }  
    }
    else {
      push()
      rotate(weapons[currentgun].spriterecoil/delay)
      rotate(1)
      scale(0.75);
      translate(0,-50)
      image(eval(weapons[currentgun].name+"gone"), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
      pop()
    }




    pop()
    weaponrotation = Math.atan2(mouseY-(height/2), mouseX-(width/2))
    
    textSize(30)
    text("💀 " + positions[id].kills, width-75, 50);
  }

  for (i=0; i<len; i++) {
    if (i!=id) {
      if (positions[i].dead==0) {
        push()
        translate(positions[i].xvel+xoffset, positions[i].yvel+yoffset)
        rotate(positions[i].gundir)
        translate(75,0)
        if(positions[i].flipgun==1){ scale(-1, 1); }
        else { scale(-1, -1); }
        if (positions[i].suicide==1) { scale(-1, 1); }
        
        image(eval(weapons[positions[i].currentgun].name), 0, 0)

        pop()

        if((positions[i].skin+positions[i].dir) != NaN) {
          image(eval(positions[i].skin+positions[i].dir), positions[i].xvel+xoffset, positions[i].yvel+yoffset)
          textSize(15)
          text(positions[i].name + " | 💀 " + String(positions[i].kills), positions[i].xvel+xoffset, positions[i].yvel+yoffset-60)
        }
        fill('white')
        
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
          else if (angle > 0) { direction = "frontright" }
          else if (angle > -1.178) { direction = "backright" }
          else if (angle > -1.963) { direction = "back" }
          else { direction = "backleft" }
          textSize(15)
          text(username + " | 💀 " + String(positions[id].kills), myposx+xoffset, myposy+yoffset-60)
          image(eval(skin+direction), xoffset+myposx, yoffset+myposy);
        }
      }
    }
  }

  if (dead == 1) {
    // nameField.position(width/2, height/2+225)
    fill('white')
    image(death,0,0,10000,10000)
    textAlign(CENTER);
    textSize(25)

    text('YOU DIED', width/2, height/2+150)
    text('SPACE to respawn', width/2, height/2+300)


    imageMode(CENTER)
    direction = "front"
    angle = mouseX-(width/2)

    if (angle > 100) { direction = "frontright" }
    else if (angle < -100) { direction = "frontleft" }
    else { direction = "front" }

    image(eval(skin+direction), width/2, height/2,200,200);



    if ((width/2)+150<mouseX && (width/2)+250>mouseX && (height/2)-50<mouseY && mouseY<(height/2)+50 && !mouseIsPressed) {
      image(arrowgone, width/2+200, height/2);
    }
    else {
      image(arrow, width/2+200, height/2);
    }

    push()
    scale(-1, 1);
    if ((width/2-150)>mouseX && (width/2-250)<mouseX && (height/2)-50<mouseY && mouseY<(height/2)+50 && !mouseIsPressed) {
      image(arrowgone, -(width/2-200), height/2,);
    }
    else {
      image(arrow, -(width/2-200), height/2,);
    }
    pop()
    
  }

  image(cursor, mouseX, mouseY) 

  let fps = frameRate();
  fill(255);
  stroke(0);
  textSize(15)
  text(fps.toFixed(0)+"FPS", 35, height - 10);

  textSize(40)
  if (weapons[currentgun].ammo >=10) {
    text(weapons[currentgun].ammo, width-90, height-25)
  }
  else {
    text("  " + weapons[currentgun].ammo, width-90, height-25)
  }
  textSize(20)
  text("/" + weapons[currentgun].maxammo, width-50, height-25)
}

function mouseWheel(event) {
  if (reloading == 0) {
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
}


setInterval(function myFunction(){
  socket.volatile.emit("move", { name: username, xvel: myposx, yvel: myposy, id: id, dir: direction, gundir: weaponrotation, flipgun: flipgun, suicide:suicide, currentgun: currentgun, skin: skin});
  if (delay<weapons[currentgun].speed) {
    delay+=1
    if (weapons[currentgun].auto == true && mouseIsPressed && mouseButton == LEFT) {
      shoot()
    }
  };
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
