const socket = io()

let id = 99
let len = 0
let positions = [[0,0,0,0,0,0,0,0]]

let myposx = 0
let myposy = 0

let xvel = 0
let yvel = 0


let weapons =  {
  ak : { speed: 10, auto: true},
  glock : { speed: 12, auto: false}
}

let delay = 0

let bullets = []

let img;
let cubeleft;
let cuberight;
let cubeback;
let cubefront;

let bulletimage;

let direction = cubefront
let mydirection = 0


let weaponrotation = 0
let suicide = 0
let flipgun = 0

let pistol
let death
let ak
let cursor

let currentgun = 0

function preload() {
  img = loadImage('bg.png');
  cubeleft = loadImage('cubepixel2.png');
  cuberight = loadImage('cubepixel1.png');
  cubefront = loadImage('cubepixel3.png');
  cubeback = loadImage('cubepixel4.png');
  cubebackleft = loadImage('cubepixel5.png');
  cubebackright = loadImage('cubepixel6.png');
  bulletimage = loadImage('bullet.png');
  cursor = loadImage('crosshair.png')
  ak = loadImage('ak.png')
  death = loadImage('death.png')
  pistol = loadImage('pistol.png')
  pistolgone = loadImage('pistolgone.png')
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity(1);
  noSmooth()
  document.addEventListener('contextmenu', event => event.preventDefault());
  
  socket.emit("addme", id);
  noCursor();
  myposx = Math.floor(Math.random() * (1000 + 1000) ) + -1000;
  myposy = Math.floor(Math.random() * (1000 + 1000) ) + -1000;
}

socket.on("updatebullets", function(x) {
  bullets=(x)
})


function shoot() {
  if (currentgun == 1) {
    if (delay>=weapons.glock.speed) {
      if (positions[id][2]==0) {
        xdiff = (mouseX - width/2)
        ydiff = (mouseY - height/2)
  
        if (keyIsDown(SHIFT)) {
          bulletxvel = - (xdiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)))
          bulletyvel = - (ydiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)))
          socket.emit("killme", id);
        }
        else {
          bulletxvel = xdiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff))
          bulletyvel = ydiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff))
        }
  
        newBullet = { xpos: myposx, ypos: myposy, bulletxvel: bulletxvel, bulletyvel: bulletyvel, id: id}
        socket.emit("bullet", newBullet);
      }
      delay = 0
    }
  }
  else {
    if (delay>=weapons.ak.speed) {
      if (positions[id][2]==0) {
        xdiff = (mouseX - width/2)
        ydiff = (mouseY - height/2)
  
        if (keyIsDown(SHIFT)) {
          bulletxvel = - (xdiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)))
          bulletyvel = - (ydiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)))
          socket.emit("killme", id);
        }
        else {
          bulletxvel = xdiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)) + (Math.random()-0.5)*0.2
          bulletyvel = ydiff/Math.sqrt((xdiff*xdiff)+(ydiff*ydiff)) + (Math.random()-0.5)*0.2
        }
  
        newBullet = { xpos: myposx, ypos: myposy, bulletxvel: bulletxvel, bulletyvel: bulletyvel, id: id}
        socket.emit("bullet", newBullet);
      }
      delay = 0
    }
  }
}

function mousePressed() {
  // fullscreen(true)
  if (mouseButton === LEFT) {
    shoot()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){
  let dead = true
  if (id != 99 && positions.length>id) {
    if (positions[id][2] == 0) { dead = false }
  }

  xoffset = (width/2)-myposx-(mouseX - windowWidth/2)/3
  yoffset = (height/2)-myposy-(mouseY - windowHeight/2)/3
  
  background('white');
  
  image(img, xoffset, yoffset, 2000, 2000);

  for (let b of bullets) {
    imageMode(CENTER)
    image(bulletimage, b.xpos + xoffset, b.ypos+yoffset)
    // if (b.id != id) {
    // if ((b.xpos < pos[i][0] + 50) && (b.xpos > pos[i][0] - 50) && (b.ypos < pos[i][1] + 50) && (b.ypos > pos[i][1] - 50)) {
    //     dead = true
    //     socket.emit("killme", id);
    //   }
    // }
    
  }

  if (dead == false) {
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

    if (currentgun == 1) {
      if (delay>=weapons.glock.speed) {
        image(pistol, 0, 0)
      }
      else {
        rotate(0.5/delay)
        image(pistolgone, 0, 0)
      }
    }
    else {
      if (delay>=weapons.ak.speed) {
        image(ak, 10, 20)
      }
      else {
        rotate(0.2/delay)
        image(ak, 10, 20)
      }
    }

    pop()

    weaponrotation = Math.atan2(mouseY-(height/2), mouseX-(width/2))
  }
  

  for (i=0; i<len; i++) {
    if (i!=id) {
      if (positions[i][2]==0) {
        if (positions[i][4]==0) { otherimage = cubefront }
        if (positions[i][4]==1) { otherimage = cubeleft }
        if (positions[i][4]==2) { otherimage = cuberight }
        if (positions[i][4]==10) { otherimage = cubeback }
        if (positions[i][4]==11) { otherimage = cubebackleft }
        if (positions[i][4]==12) { otherimage = cubebackright }
        image(otherimage, positions[i][0]+xoffset, positions[i][1]+yoffset)
        fill('white')

        push()
        translate(positions[i][0]+xoffset, positions[i][1]+yoffset)
        rotate(positions[i][5])
        translate(75,0)
        if(positions[i][6]==1){ scale(-1, 1);
        }
        else { scale(-1, -1);
        }
        if (positions[i][7]==1) { scale(-1, 1);
        }
        image(pistol, 0, 0)
        pop()
        
      }
    }
    else {
      if (i<len) {
        if (positions[id][2] == 0) {
          imageMode(CENTER)
          direction = cubefront
          if (mouseX - xoffset-myposx > 50) {
            if (mouseY - (height/2)-(mouseY - windowHeight/2)/3 > -50) { direction=cuberight }
            else { direction=cubebackright }
          }
          else if (mouseX - xoffset-myposx < -50) {
            if (mouseY - (height/2)-(mouseY - windowHeight/2)/3 > -50) { direction=cubeleft }
            else { direction=cubebackleft }
          }
          else {
            if (mouseY - (height/2)-(mouseY - windowHeight/2)/3 > 0) { direction=cubefront }
            else if (mouseY - (height/2)-(mouseY - windowHeight/2)/3 < 0) { direction=cubeback }
          }
          image(direction, xoffset+myposx, yoffset+myposy);

          
        }
      }
    }
  }
  
  xvel = 0
  yvel = 0
  

  if (keyIsDown(68) === true) { xvel += 10 }
  if (keyIsDown(65) === true) { xvel -= 10 }
  if (keyIsDown(87) === true) { yvel -= 10 }
  if (keyIsDown(83) === true) { yvel += 10 }
  if (dead == true) {
    if (keyIsDown(32) === true) { window.location.reload() }
  }

  if ((Math.abs(xvel) != 0) && (Math.abs(yvel) != 0)) {
    xvel *= 0.707
    yvel *= 0.707
  }

  
  // if (xvel != 0 || yvel != 0) {
    if (direction==cubefront) { mydirection = 0 }
    if (direction==cubeleft) { mydirection = 1 }
    if (direction==cuberight) { mydirection = 2 }
    if (direction==cubeback) { mydirection = 10 }
    if (direction==cubebackleft) { mydirection = 11 }
    if (direction==cubebackright) { mydirection = 12 }
    myposx += xvel
    myposy += yvel
    myposx = constrain(myposx, -1000, 1000)
    myposy = constrain(myposy, -1000, 1000)
  // }


  if (dead == true) {
    fill('white')
    image(death,0,0,10000,10000)
    textAlign(CENTER);
    text('SPACE to respawn', width/2, height/2)
  }
  
  image(cursor, mouseX, mouseY)
  
}



function mouseWheel(event) {
  console.log(Object.keys(weapons).length)
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
  // Uncomment to prevent any default behavior.
  // return false;
}


setInterval(function myFunction(){
  socket.volatile.emit("move", { xvel: myposx, yvel: myposy, id: id, dir: mydirection, gundir: weaponrotation, flipgun: flipgun, suicide:suicide});
}, 1000/60);

socket.on("updatepositions", function(x) {
  if (id == 99) {
    id = x.length
    len += 1
  }
  len = x.length
  positions = x
})


setInterval(function myFunction(){
  if (delay<weapons.glock.speed) {
    delay+=1
  };
  if (currentgun == 0 && mouseIsPressed) {
    shoot()
  }
}, 1000/60);

