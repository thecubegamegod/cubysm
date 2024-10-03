const socket = io()

let id = 99
let len = 0
let positions = []

let myposx = 0
let myposy = 0

let xvel = 0
let yvel = 0

let reloading = 0


let firstspawn = 1


let prevkills = 0

let flash = 0


let deathangle = 0

let aksfx
let glocksfx
let deaglesfx
let snipersfx
let hitsfx
let uzisfx

let nahsfx
let ahsfx
let yeowchsfx
let owsfx
let euhsfx

let reloadtimerid

let skin = "cube"
let skinnum = 0


// to get speed do 3600/RPM

let weapons =  [
  { name: "ak", simul:1, dropoff:0.9, zoom:3, damage: 20, reloadspeed: 2, ammo:30, maxammo:30, speed: 6, auto: true, spread:0.3, recoil:4, spriterecoil: 0.2, bulletspd: 1, xoffset:10, yoffset:20},
  { name: "uzi", simul:1, dropoff:0.9, zoom:3, damage: 20, reloadspeed: 1.75, ammo:25, maxammo:25, speed: 4.5, auto: true, spread:0.15, recoil:1, spriterecoil: 0.2, bulletspd: 0.8, xoffset:0, yoffset:13},
  { name: "glock", simul:1, dropoff:0.9, zoom:3, damage: 20, reloadspeed: 1.5, ammo:17, maxammo:17, speed: 12, auto: false, spread:0, recoil:6, spriterecoil: 0.5, bulletspd: 0.8, xoffset:0, yoffset:15},
  { name: "deagle", simul:1, dropoff:0.9, zoom:3, damage: 60, reloadspeed: 1.5, ammo:7, maxammo:7, speed: 12, auto: false, spread:0, recoil:18, spriterecoil: 1, bulletspd: 1, xoffset:30, yoffset:20},
  { name: "sniper", simul:1, dropoff:1, zoom:1, damage: 100, reloadspeed: 0.7, ammo:5, maxammo:5, speed: 100, auto: false, spread:0, recoil:18, spriterecoil: 0.7, bulletspd: 2 , xoffset:30, yoffset:15},
  { name: "shorty", simul:8, dropoff:1, zoom:3, damage: 50, reloadspeed: 1, ammo:12, maxammo:2, speed: 75, auto: false, spread:0.4, recoil:30, spriterecoil: 0.7, bulletspd: 0.6 , xoffset:0, yoffset:15},
  { name: "benelli", simul:6, dropoff:1, zoom:3, damage: 30, reloadspeed: 2, ammo:6, maxammo:6, speed: 25, auto: true, spread:0.3, recoil:0, spriterecoil: 0.3, bulletspd: 0.8 , xoffset:0, yoffset:15}
]

let skinslist = [
  {name: "cube", primary: 0, secondary: 2, speed:1.1 },
  {name: "cat", primary: 4, secondary: 5, speed:0.8 },
  {name: "bird", primary: 1, secondary: 3, speed:1.2 },
  {name: "hamster", primary: 6, secondary: 2, speed:1.1 }
]

let delay = 0

let bullets = []
let localbullets = []

let img;
let bricks
let cubefront;

let bulletimage;

let direction = "front"


let username = "fellow"

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
  arrow = loadImage('arrow.png');
  arrowgone = loadImage('arrowempty.png');

  bulletimage = loadImage('bullet.png');
  cursor = loadImage('crosshair.png')
  ak = loadImage('ak.png')
  akgone = loadImage('ak.png')
  sniper = loadImage('sniper.png')
  snipergone = loadImage('sniper.png')
  deagle = loadImage('deagle.png')
  deaglegone = loadImage('deaglegone.png')
  uzi = loadImage('uzi.png')
  uzigone = loadImage('uzi.png')
  death = loadImage('death.png')
  glock = loadImage('pistolold.png')
  glockgone = loadImage('pistolgoneold.png')
  shorty = loadImage('shorty.png')
  shortygone = loadImage('shorty.png')
  benelli = loadImage('benelli.png')
  benelligone = loadImage('benelli.png')

  aktile = loadImage('aktile.png')
  glocktile = loadImage('glocktile.png')
  snipertile = loadImage('snipertile.png')
  shortytile = loadImage('shortytile.png')
  deagletile = loadImage('deagletile.png')
  uzitile = loadImage('uzitile.png')
  benellitile = loadImage('benellitile.png')

  catfrontleft = loadImage('catfront3.png');
  catfrontright = loadImage('catfront1.png');
  catfront = loadImage('catfront2.png');
  catback = loadImage('catfront5.png');
  catbackleft = loadImage('catfront4.png');
  catbackright = loadImage('catfront6.png');

  birdfrontleft = loadImage('bill6.png');
  birdfrontright = loadImage('bill4.png');
  birdfront = loadImage('bill3.png');
  birdback = loadImage('bill2.png');
  birdbackleft = loadImage('bill1.png');
  birdbackright = loadImage('bill5.png');

  hamsterfrontleft = loadImage('hamster.png');
  hamsterfrontright = loadImage('hamster.png');
  hamsterfront = loadImage('hamster.png');
  hamsterback = loadImage('hamster.png');
  hamsterbackleft = loadImage('hamster.png');
  hamsterbackright = loadImage('hamster.png');
}


function respawnMe(){
  socket.emit("addme", id);
  currentgun=skinslist[skinnum].primary
  myposx = Math.floor(Math.random() * (1000 + 1000)) + -1000;
  myposy = Math.floor(Math.random() * (1000 + 1000)) + -1000;
  for(i=0; i<weapons.length; i++) {
    weapons[i].ammo = weapons[i].maxammo
  }
}

function setup() {
  skinnum = Math.floor(Math.random()*skinslist.length)
  currentgun=skinslist[skinnum].primary
  skin = skinslist[skinnum].name
  aksfx = loadSound('ak.mp3');
  glocksfx = loadSound('glock.mp3');
  uzisfx = loadSound('uzi.mp3');
  deaglesfx = loadSound('deagle.mp3');
  snipersfx = loadSound('sniper.mp3');
  shortysfx = loadSound('shorty.mp3');
  benellisfx = loadSound('shorty.mp3');

  hitsfx = loadSound('hit.mp3');
  
  nahsfx = loadSound('nah.mp3');
  ahsfx = loadSound('ah.mp3');
  yeowchsfx = loadSound('yeowch.mp3');
  owsfx = loadSound('ow.mp3');
  euhsfx = loadSound('euh.mp3');

  
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
      if (skinnum<skinslist.length-1) {
        skinnum+=1
      }
      else {
        skinnum = 0
      }
      skin = skinslist[skinnum].name
    }
    if ((width/2-150)>mouseX && (width/2-250)<mouseX && (height/2)-50<mouseY && mouseY<(height/2)+50) {
      if (skinnum>0) {
        skinnum-=1
      }
      else {
        skinnum = skinslist.length-1
      }
      skin = skinslist[skinnum].name
    }
  }
}



function reload() {
  if (reloading == 0) {
    if (weapons[currentgun].ammo<weapons[currentgun].maxammo) {
      weapons[currentgun].ammo = 0
      reloading = 1
      reloadtimerid = setTimeout(function myFunction(){
        weapons[currentgun].ammo = weapons[currentgun].maxammo
        reloading = 0
      }, weapons[currentgun].reloadspeed*1000);
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
    if (key === 'r') {
      reload()
    }
    // if (keyCode>=48 && keyCode <= 57) {
    //   if (keyCode == 48) {
    //     keyCode = 58
    //     clearTimeout(reloadtimerid)
    //     reloading = 0
    //   }
    //   if (keyCode-48<=weapons.length) {
    //     currentgun=keyCode-49
    //     clearTimeout(reloadtimerid)
    //     reloading = 0
    //   }
    // }
    if (keyCode == 49) {
      currentgun=skinslist[skinnum].primary
      clearTimeout(reloadtimerid)
      reloading = 0
    }
    if (keyCode == 50) {
      currentgun=skinslist[skinnum].secondary
      clearTimeout(reloadtimerid)
      reloading = 0
    }
  }
}


function shoot() {
  if (weapons[currentgun].ammo>0) {
    if (delay>=weapons[currentgun].speed || weapons[currentgun].auto == false) {
    // if (delay>=weapons[currentgun].speed) {
      if (positions[id].dead==0) {
        xdiff = (mouseX - width/2)
        ydiff = (mouseY - height/2)
  
        for (i=0;i<weapons[currentgun].simul;i++) {
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

          newBullet = { dropoff: weapons[currentgun].dropoff, xpos: myposx, ypos: myposy, bulletxvel: bulletxvel, bulletyvel: bulletyvel, id: id, dmg: weapons[currentgun].damage}
          socket.emit("bullet", newBullet);
          localbullets.push(newBullet)
        }
        weapons[currentgun].ammo-=1
        delay = 0
        socket.emit("gunsfx", weapons[currentgun].name + "sfx")
      }
    }
    recoilx = -bulletxvel*weapons[currentgun].recoil
    recoily = -bulletyvel*weapons[currentgun].recoil
  }
  else {
    reload()
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

  if (dead == 0) {
    if (positions[id].flash > 0) {
      tint(218, 0, 99);
    }
    else {
      noTint()
    }
  }
  
  xvel = 0
  yvel = 0

  if (dead == 1) {
    if (keyIsDown(32) === true) {
      // window.location.reload()
      firstspawn = 0
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

  myposx += xvel*skinslist[skinnum].speed
  myposy += yvel*skinslist[skinnum].speed
  myposx = constrain(myposx, -1000, 1000)
  myposy = constrain(myposy, -1000, 1000)


  xoffset = (width/2)-myposx-(mouseX - windowWidth/2)/weapons[currentgun].zoom
  yoffset = (height/2)-myposy-(mouseY - windowHeight/2)/weapons[currentgun].zoom
  background('white');


  noStroke()
  image(img, width/2, height/2, width+4, height+4);
  image(img, xoffset, yoffset, 2000, 2000);


  for (let b of localbullets) {
    b.ypos += b.bulletyvel*90
    b.xpos += b.bulletxvel*90
    if (b.xpos<-1000 || b.xpos>1000|| b.ypos<-1000 || b.ypos>1000) {
      localbullets.splice(b, 1);
    }
    b.bulletyvel*=0.9
    b.bulletxvel*=0.9
    
    if (Math.sqrt((b.bulletyvel)*(b.bulletyvel)+(b.bulletxvel)*(b.bulletxvel))<=0.1) {
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
    // if (positions[id].flash == 1) {
    //   setTimeout(function myFunction(){
    //     socket.volatile.emit("noflash", { id: id});
    //   }, 100);
    // }
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
    
    push()
    textAlign(RIGHT)
    textSize(25)
    text("🔥 " + positions[id].streak, width-25, 50);
    text("⚔️ " + positions[id].kills, width-25, 80);
    text("💀 " + positions[id].deaths, width-25, 110);
    textAlign(LEFT)
    text("❤️ " + positions[id].hp, 25, height-110);
    pop()


    if (prevkills<positions[id].kills) {
      hitsfx.play()
    }
    prevkills = positions[id].kills
 
  }

  for (i=0; i<len; i++) {
    if (i!=id) {
      if (positions[i].dead==0 && dead==0) {
        push()
        translate(positions[i].xvel+xoffset, positions[i].yvel+yoffset)
        rotate(positions[i].gundir)
        translate(75,0)
        if(positions[i].flipgun==1){ scale(-1, 1); }
        else { scale(-1, -1); }
        if (positions[i].suicide==1) { scale(-1, 1); }
        

        image(eval(weapons[positions[i].currentgun].name), 0, 0)

        pop()

        // push()
        // translate(positions[i].xvel+xoffset, positions[i].yvel+yoffset)
        // rotate(1.5708)
        // if (currentgun == skinslist[skinnum].primary) {
        //   image(eval(weapons[skinslist[skinnum].secondary].name), 0, 0)
        // }
        // else {
        //   image(eval(weapons[skinslist[skinnum].primary].name), 0, 0)
        // }
        // pop()


        if((positions[i].skin+positions[i].dir) != NaN) {
          if (positions[i].flash > 0) {
            tint(218, 0, 99);
          }
          image(eval(positions[i].skin+positions[i].dir), positions[i].xvel+xoffset, positions[i].yvel+yoffset)
          noTint()
          if (dead == 0) {
            if (positions[id].flash > 0) {
              tint(218, 0, 99);
            }
            else {
              noTint()
            }
          }
          textSize(15)
          text(positions[i].name + " | 🔥" + String(positions[i].streak), positions[i].xvel+xoffset, positions[i].yvel+yoffset-60)
          textSize(13)
          text("❤️".repeat(Math.round(positions[i].hp/20)) + "🤍".repeat(5-(Math.round(positions[i].hp/20))), positions[i].xvel+xoffset, positions[i].yvel+yoffset-80)
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
          text(username + " | 🔥" + String(positions[id].streak), myposx+xoffset, myposy+yoffset-60)
          textSize(13)
          text("❤️".repeat(Math.round(positions[id].hp/20)) + "🤍".repeat(5-(Math.round(positions[id].hp/20))), myposx+xoffset, myposy+yoffset-80)
          
          image(eval(skin+direction), xoffset+myposx, yoffset+myposy);
        }
      }
    }
  }

  if (dead == 1) {
    noTint()
    // nameField.position(width/2, height/2+225)
    fill('white')
    image(death,0,0,10000,10000)
    textAlign(CENTER);
    textSize(25)


    if (firstspawn == 1) {
      text('WELCOME', width/2, height/2-250)
      text('SPACE to start', width/2, height/2-200)
    }
    else {
      text('YOU DIED', width/2, height/2-250)
      text('SPACE to respawn', width/2, height/2-200)
    }

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



    image(eval(weapons[skinslist[skinnum].primary].name+"tile"), (width/2)-104, height/2 +300);
    image(eval(weapons[skinslist[skinnum].secondary].name+"tile"), (width/2)+104, height/2 +300);
    

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
  if (currentgun == skinslist[skinnum].primary) {
    currentgun = skinslist[skinnum].secondary
  }
  else {
    currentgun = skinslist[skinnum].primary
  }
  clearTimeout(reloadtimerid)
  reloading = 0
  return false;
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
