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
let knifesfx



let map = [
  ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", "X", "X", "X", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", "X", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", "X", "X", "X", "X", "X", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", "X", "X", "X", " ", " ", " ", " ", " ", "X", "X", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", "X", "X", "X", "X", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", "X", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", "X", " ", " ", "X", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "X", " ", " ", " ", " ", " ", " ", " ", " "],
  ["X", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]
]


let nahsfx
let ahsfx
let yeowchsfx
let owsfx
let euhsfx

let reloadtimerid

let skin = "cube"
let sub = ""
let subnum = 0
let skinnum = 0


// to get speed do 3600/RPM

let weapons =  [
  { name: "ak", hitscan:false, laser:false, hidebullet:false, simul:1, dropoff:0.9, zoom:3, damage: 20, reloadspeed: 2.4, ammo:30, maxammo:30, speed: 6, auto: true, spread:0.3, recoil:4, spriterecoil: 0.2, spritehorizrecoil: 0, bulletspd: 1, xoffset:10, yoffset:20},
  { name: "uzi", hitscan:false, laser:false, hidebullet:false, simul:1, dropoff:0.9, zoom:3, damage: 20, reloadspeed: 1.75, ammo:25, maxammo:25, speed: 5, auto: true, spread:0.15, recoil:1, spriterecoil: 0.2, spritehorizrecoil: 0, bulletspd: 0.8, xoffset:-10, yoffset:13},
  { name: "glock", hitscan:false, laser:false, hidebullet:false, simul:1, dropoff:0.9, zoom:3, damage: 20, reloadspeed: 1.5, ammo:17, maxammo:17, speed: 9, auto: false, spread:0, recoil:6, spriterecoil: 0.7, spritehorizrecoil: 0, bulletspd: 0.8, xoffset:0, yoffset:15},
  { name: "deagle", hitscan:false, laser:false, hidebullet:false, simul:1, dropoff:0.9, zoom:3, damage: 60, reloadspeed: 2.2, ammo:7, maxammo:7, speed: 13, auto: false, spread:0, recoil:18, spriterecoil: 1, spritehorizrecoil: 0, bulletspd: 1, xoffset:0, yoffset:20},
  { name: "sniper", hitscan:true, laser:true, hidebullet:false, simul:1, dropoff:1, zoom:1, damage: 100, reloadspeed: 3.7, ammo:5, maxammo:5, speed: 88, auto: false, spread:0, recoil:18, spriterecoil: 0.7, spritehorizrecoil: 0, bulletspd: 0.8 , xoffset:-30, yoffset:20},
  { name: "shorty", hitscan:false, laser:false, hidebullet:false, simul:8, dropoff:0.9, zoom:3, damage: 50, reloadspeed: 1, ammo:12, maxammo:2, speed: 24, auto: false, spread:0.4, recoil:30, spriterecoil: 1, spritehorizrecoil: 0, bulletspd: 0.6 , xoffset:0, yoffset:15},
  { name: "benelli", hitscan:false, laser:false, hidebullet:false, simul:6, dropoff:0.9, zoom:3, damage: 30, reloadspeed: 2, ammo:6, maxammo:6, speed: 9, auto: false, spread:0.3, recoil:30, spriterecoil: 0.3, spritehorizrecoil: 0, bulletspd: 0.8 , xoffset:0, yoffset:15},
  { name: "knife", hitscan:false, laser:false, hidebullet:true, simul:1, dropoff:0.6, zoom:3, damage: 80, reloadspeed: 0, ammo:99999999999999, maxammo:99999999999999, speed: 30, auto: true, spread:0, recoil:0, spriterecoil: 0.2, spritehorizrecoil: -2, bulletspd: 1 , xoffset:10, yoffset:7}
]

let skinslist = [
  { name: "cube", fullname: "Cube", primary: 0, secondary: 2, tertiary: 7, speed: 1.1, sub: [""] },
  { name: "cat", fullname: "Cat", primary: 4, secondary: 5, tertiary: 7, speed: 0.8, sub: ["", "hal"] },
  { name: "bird", fullname: "Bird", primary: 1, secondary: 3, tertiary: 7, speed: 1.2, sub: [""] },
  { name: "hamster", fullname: "Hamster", primary: 6, secondary: 2, tertiary: 7, speed: 1.1, sub: [""] }
]

let delay = 999

let zoomsmoothed = 3
let smoothfactor = 1

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


// p5.disableFriendlyErrors = true;

let death
let cursor
let title
let spawn
let cursorgone

let recoilx = 0
let recoily = 0

let currentgun = 0

function preload() {
  shadow = loadImage('shadow.png')
  titlepic = loadImage('title.png')
  onekey = loadImage('1.png')
  twokey = loadImage('2.png')
  spawnpic = loadImage('spawn.png')
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
  cursorgone = loadImage('crosshairgone.png')
  ak = loadImage('weapons/ak.png')
  akgone = loadImage('weapons/ak.png')
  sniper = loadImage('weapons/sniper.png')
  snipergone = loadImage('weapons/sniper.png')
  deagle = loadImage('weapons/deagle.png')
  deaglegone = loadImage('weapons/deaglegone.png')
  uzi = loadImage('weapons/uzi.png')
  uzigone = loadImage('weapons/uzi.png')
  death = loadImage('death.png')
  glock = loadImage('weapons/glock.png')
  glockgone = loadImage('weapons/glockgone.png')
  shorty = loadImage('weapons/shorty.png')
  shortygone = loadImage('weapons/shorty.png')

  knife = loadImage('weapons/knife.png')
  knifegone = loadImage('weapons/knife.png')

  benelli = loadImage('weapons/benelli.png')
  benelligone = loadImage('weapons/benelli.png')

  aktile = loadImage('weapons/tiles/aktile.png')
  glocktile = loadImage('weapons/tiles/glocktile.png')
  snipertile = loadImage('weapons/tiles/snipertile.png')
  shortytile = loadImage('weapons/tiles/shortytile.png')
  deagletile = loadImage('weapons/tiles/deagletile.png')
  uzitile = loadImage('weapons/tiles/uzitile.png')
  benellitile = loadImage('weapons/tiles/benellitile.png')
  knifetile = loadImage('weapons/tiles/knifetile.png')

  catfrontleft = loadImage('catfront3.png');
  catfrontright = loadImage('catfront1.png');
  catfront = loadImage('catfront2.png');
  catback = loadImage('catfront5.png');
  catbackleft = loadImage('catfront4.png');
  catbackright = loadImage('catfront6.png');

  cathalfrontleft = loadImage('cathalfront3.png');
  cathalfrontright = loadImage('cathalfront1.png');
  cathalfront = loadImage('cathalfront2.png');
  cathalback = loadImage('cathalfront5.png');
  cathalbackleft = loadImage('cathalfront4.png');
  cathalbackright = loadImage('cathalfront6.png');

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


function respawnMe() {
  delay = 999
  socket.emit("addme", id);
  currentgun = skinslist[skinnum].primary
  myposx = Math.floor(Math.random() * (2000 + 2000)) + -2000;
  myposy = Math.floor(Math.random() * (2000 + 2000)) + -2000;
  for (i = 0; i < weapons.length; i++) {
    weapons[i].ammo = weapons[i].maxammo
  }
}


function changeTitle(newTitle) {
  if (document.title != newTitle) {
    document.title = newTitle;
  }
}


function setup() {
  skinnum = Math.floor(Math.random() * skinslist.length)
  subnum = Math.floor(Math.random() * skinslist[skinnum].sub.length)
  currentgun = skinslist[skinnum].primary
  skin = skinslist[skinnum].name
  sun = skinslist[skinnum].sub[subnum]
  aksfx = loadSound('ak.mp3');
  glocksfx = loadSound('glock.mp3');
  uzisfx = loadSound('uzi.mp3');
  deaglesfx = loadSound('deagle.mp3');
  snipersfx = loadSound('sniper.mp3');
  shortysfx = loadSound('shorty.mp3');
  benellisfx = loadSound('shorty.mp3');
  knifesfx = loadSound('knife.mp3');

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

socket.on("updatebullets", function (x) {
  bullets = (x)
})

function mousePressed() {
  if (positions[id].dead == 0) {
    if (mouseButton === LEFT) {
      shoot()
    }
  }
  else {
    if ((width / 2) + 150 < mouseX && (width / 2) + 250 > mouseX && (height / 2) - 50 < mouseY && mouseY < (height / 2) + 50) {
      if (skinnum < skinslist.length - 1) {
        skinnum += 1
      }
      else {
        skinnum = 0
      }
      skin = skinslist[skinnum].name
    }
    if ((width / 2 - 150) > mouseX && (width / 2 - 250) < mouseX && (height / 2) - 50 < mouseY && mouseY < (height / 2) + 50) {
      if (skinnum > 0) {
        skinnum -= 1
      }
      else {
        skinnum = skinslist.length - 1
      }
      skin = skinslist[skinnum].name
    }
  }
}


function reload() {
  if (reloading == 0) {
    if (weapons[currentgun].ammo < weapons[currentgun].maxammo) {
      reloading = 1
      reloadtimerid = setTimeout(function myFunction() {
        // if (weapons[currentgun].ammo==0) {
        weapons[currentgun].ammo = weapons[currentgun].maxammo
        // }
        // else {
        //   weapons[currentgun].ammo = weapons[currentgun].maxammo + 1
        // }
        reloading = 0
      }, weapons[currentgun].reloadspeed * 1000);
    }
  }
}


function keyPressed() {
  key = key.toLowerCase()

  if ((key === 'o') && (positions[id].dead == 1)) {
    if (subnum < skinslist[skinnum].sub.length - 1) {
      subnum += 1
    }
    else {
      subnum = 0
    }
    sub = skinslist[skinnum].sub[subnum]
  }

  if (key == "z") {
    console.log(positions)
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
      currentgun = skinslist[skinnum].primary
      clearTimeout(reloadtimerid)
      reloading = 0
    }
    if (keyCode == 50) {
      currentgun = skinslist[skinnum].secondary
      clearTimeout(reloadtimerid)
      reloading = 0
    }
    if (keyCode == 51) {
      currentgun = skinslist[skinnum].tertiary
      clearTimeout(reloadtimerid)
      reloading = 0
    }
  }
}


function shoot() {
  if (weapons[currentgun].ammo > 0 && reloading == 0) {
    if (delay >= weapons[currentgun].speed) {
      // if (delay>=weapons[currentgun].speed) {
      if (positions[id].dead == 0) {
        xdiff = (mouseX - width / 2)
        ydiff = (mouseY - height / 2)

        for (i = 0; i < weapons[currentgun].simul; i++) {
          if (keyIsDown(SHIFT)) {
            bulletxvel = - ((xdiff / Math.sqrt((xdiff * xdiff) + (ydiff * ydiff))) + (Math.random() - 0.5) * weapons[currentgun].spread) * weapons[currentgun].bulletspd
            bulletyvel = - ((ydiff / Math.sqrt((xdiff * xdiff) + (ydiff * ydiff))) + (Math.random() - 0.5) * weapons[currentgun].spread) * weapons[currentgun].bulletspd
            socket.emit("killme", id);
          }
          else {
            bulletxvel = (xdiff / Math.sqrt((xdiff * xdiff) + (ydiff * ydiff)) + (Math.random() - 0.5) * weapons[currentgun].spread) * weapons[currentgun].bulletspd
            bulletyvel = (ydiff / Math.sqrt((xdiff * xdiff) + (ydiff * ydiff)) + (Math.random() - 0.5) * weapons[currentgun].spread) * weapons[currentgun].bulletspd
          }

          // endofgunx = myposx + bulletxvel/(abs(bulletxvel)+abs(bulletyvel))*300
          // endofguny = myposy + bulletyvel/(abs(bulletxvel)+abs(bulletyvel))*300

          newBullet = { hitscan: weapons[currentgun].hitscan, hidebullet: weapons[currentgun].hidebullet, dropoff: weapons[currentgun].dropoff, xpos: myposx, ypos: myposy, bulletxvel: bulletxvel, bulletyvel: bulletyvel, id: id, dmg: weapons[currentgun].damage}
          socket.emit("bullet", newBullet);
          localbullets.push(newBullet)
        }
        weapons[currentgun].ammo -= 1
        delay = 0
        socket.emit("gunsfx", weapons[currentgun].name + "sfx")
        if (weapons[currentgun].auto == 0) {
          recoilx = -bulletxvel * weapons[currentgun].recoil
          recoily = -bulletyvel * weapons[currentgun].recoil
        }
      }
    }
    if (weapons[currentgun].auto == 1) {
      recoilx = -bulletxvel * weapons[currentgun].recoil
      recoily = -bulletyvel * weapons[currentgun].recoil
    }
  }
  else {
    reload()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  let dead = 1

  if (id != 99 && positions.length > id) {
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



  for (i = 0; i < 20; i++) {
    for (j = 0; j < 20; j++) {
      if (map[j][i] == "X") {

        if ((myposx+xvel>=(i * 100) - 2000) && (myposx+xvel<=(i * 100) - 2000 +100) && ((j * 100) - 2000 <= myposy) && ((j * 100) -2000 +100 >= myposy) && xvel != 0 ) {
          if (myposx+xvel>=(i * 100) - 2000 + 50) {
            if (xvel<0) {
              xvel = 0
            }
          }
          else{
            if (xvel>0) {
              xvel = 0
            }
          }
        }

        if ((myposy+yvel>=(j * 100) - 2000) && (myposy+yvel<=(j * 100) - 2000 +100) && ((i * 100) - 2000 <= myposx) && ((i * 100) -2000 +100 >= myposx) && yvel != 0 ) {
          if (myposy+yvel>=(j * 100) - 2000 + 50) {
            if (yvel<0) {
              yvel = 0
            }
          }
          else{
            if (yvel>0) {
              yvel = 0
            }
          }
        }


      }
    }
  }
  

  myposx += xvel * skinslist[skinnum].speed
  myposy += yvel * skinslist[skinnum].speed
  myposx = constrain(myposx, -2000, 2000)
  myposy = constrain(myposy, -2000, 2000)


  if (zoomsmoothed > weapons[currentgun].zoom) {
    zoomsmoothed -= 0.5
  }
  else if (zoomsmoothed < weapons[currentgun].zoom) {
    zoomsmoothed += 0.5
  }


  xoffset = (width / 2) - myposx - (mouseX - windowWidth / 2) / zoomsmoothed
  yoffset = (height / 2) - myposy - (mouseY - windowHeight / 2) / zoomsmoothed
  background('white');



  noStroke()
  image(img, width / 2, height / 2, width + 4, height + 4);
  image(img, xoffset, yoffset, 4000, 4000);


  for (let b of localbullets) {


    for (i = 0; i < 20; i++) {
      for (j = 0; j < 20; j++) {
        if (map[j][i] == "X") {
  
          if ((b.xpos+b.bulletxvel>=(i * 100) - 2000) && (b.xpos+b.bulletxvel<=(i * 100) - 2000 +100) && ((j * 100) - 2000 <= b.ypos) && ((j * 100) -2000 +100 >= b.ypos) && b.bulletxvel != 0 ) {
            if (b.xpos+b.bulletxvel>=(i * 100) - 2000 + 50) {
              if (b.bulletxvel<0) {
                const index = localbullets.indexOf(b);
                if (index > -1) {
                  localbullets.splice(index, 1);
                }
              }
            }
            else{
              if (b.bulletxvel>0) {
                const index = localbullets.indexOf(b);
                if (index > -1) {
                  localbullets.splice(index, 1);
                }
              }
            }
          }
  
          if ((b.ypos+b.bulletyvel>=(j * 100) - 2000) && (b.ypos+b.bulletyvel<=(j * 100) - 2000 +100) && ((i * 100) - 2000 <= b.xpos) && ((i * 100) -2000 +100 >= b.xpos) && b.bulletyvel != 0 ) {
            if (b.ypos+b.bulletyvel>=(j * 100) - 2000 + 50) {
              if (b.bulletyvel<0) {
                const index = localbullets.indexOf(b);
                if (index > -1) {
                  localbullets.splice(index, 1);
                }
              }
            }
            else{
              if (b.bulletyvel>0) {
                const index = localbullets.indexOf(b);
                if (index > -1) {
                  localbullets.splice(index, 1);
                }
              }
            }
          }
  
  
        }
      }
    }




    b.ypos += b.bulletyvel * 90
    b.xpos += b.bulletxvel * 90
    if (b.xpos < -2000 || b.xpos > 2000 || b.ypos < -2000 || b.ypos > 2000) {
      localbullets.splice(b, 1);
    }
    b.bulletyvel *= b.dropoff
    b.bulletxvel *= b.dropoff

    if (Math.sqrt((b.bulletyvel) * (b.bulletyvel) + (b.bulletxvel) * (b.bulletxvel)) <= 0.1) {
      localbullets.splice(b, 1);
    }
    if (b.hidebullet == false) {
      image(bulletimage, b.xpos + xoffset, b.ypos + yoffset)
    }
  }

  for (let b of bullets) {
    imageMode(CENTER)
    if (b.id != id) {
      if (b.hidebullet == false) {
        image(bulletimage, b.xpos + xoffset, b.ypos + yoffset)
      }
    }
  }

  if (dead == 0) {
    changeTitle("CUBYSM")
    // if (positions[id].flash == 1) {
    //   setTimeout(function myFunction(){
    //     socket.volatile.emit("noflash", { id: id});
    //   }, 100);
    // }
    // nameField.position(-300, 100)
    image(shadow, xoffset+myposx, yoffset+myposy);
    nameField.position(-300, 100)
    push()
    translate(xoffset + myposx, yoffset + myposy)
    rotate(Math.atan2(mouseY - (height / 2), mouseX - (width / 2)))
    translate(75, 0)
    suicide = 0
    if (mouseX - (width / 2) >= 0) {
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
        if (weapons[currentgun].laser == true) {
          strokeWeight(4)
          stroke('#da0063')
          line(0, 0, -5000, 0)
          strokeWeight(1)
          stroke('white')
          line(0, 0, -5000, 0)
        }
        image(eval(weapons[currentgun].name), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
      }
      else {
        translate((weapons[currentgun].spritehorizrecoil / delay) * 30, 0)
        rotate(weapons[currentgun].spriterecoil / delay)
        image(eval(weapons[currentgun].name + "gone"), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
      }
    }
    else {
      push()
      rotate(weapons[currentgun].spriterecoil / delay)
      rotate(1)
      // scale(0.75);
      translate(0, -50)
      image(eval(weapons[currentgun].name + "gone"), weapons[currentgun].xoffset, weapons[currentgun].yoffset)
      pop()
    }

    pop()
    weaponrotation = Math.atan2(mouseY - (height / 2), mouseX - (width / 2))

    push()
    textAlign(RIGHT)
    textSize(25)
    text("🔥 " + positions[id].streak, width - 25, 50);
    text("⚔️ " + positions[id].kills, width - 25, 80);
    text("💀 " + positions[id].deaths, width - 25, 110);
    textAlign(LEFT)
    text("❤️ " + positions[id].hp, 25, height - 110);
    pop()


    if (prevkills < positions[id].kills) {
      hitsfx.play()
    }
    prevkills = positions[id].kills

  }

  for (i = 0; i < len; i++) {
    if (i != id) {
      if (positions[i].dead == 0 && dead == 0) {
        push()
        translate(positions[i].xvel + xoffset, positions[i].yvel + yoffset)
        rotate(positions[i].gundir)
        translate(75, 0)
        if (positions[i].flipgun == 1) { scale(-1, 1); }
        else { scale(-1, -1); }
        if (positions[i].suicide == 1) { scale(-1, 1); }


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


        if ((positions[i].skin + positions[i].dir) != NaN) {
          if (positions[i].flash > 0) {
            tint(218, 0, 99);
          }
          image(eval(positions[i].skin + positions[i].dir), positions[i].xvel + xoffset, positions[i].yvel + yoffset)
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
          text(positions[i].name + " | 🔥" + String(positions[i].streak), positions[i].xvel + xoffset, positions[i].yvel + yoffset - 60)
          textSize(13)
          text("❤️".repeat(Math.round(positions[i].hp / 20)) + "💜".repeat(5 - (Math.round(positions[i].hp / 20))), positions[i].xvel + xoffset, positions[i].yvel + yoffset - 80)
        }
        fill('white')

      }
    }
    else {
      if (i < len) {
        if (positions[id].dead == 0) {
          imageMode(CENTER)
          direction = "front"
          angle = Math.atan2(mouseY - (height / 2), mouseX - (width / 2))

          if (angle > 1.963) { direction = "frontleft" }
          else if (angle > 1.178) { direction = "front" }
          else if (angle > 0) { direction = "frontright" }
          else if (angle > -1.178) { direction = "backright" }
          else if (angle > -1.963) { direction = "back" }
          else { direction = "backleft" }
          textSize(15)
          text(username + " | 🔥" + String(positions[id].streak), myposx + xoffset, myposy + yoffset - 60)
          textSize(13)
          text("❤️".repeat(Math.round(positions[id].hp / 20)) + "💜".repeat(5 - (Math.round(positions[id].hp / 20))), myposx + xoffset, myposy + yoffset - 80)

          image(eval(skin + sub + direction), xoffset + myposx, yoffset + myposy);


          for (i = 0; i < 20; i++) {
            for (j = 0; j < 20; j++) {
              if (map[j][i] == "X") {
                strokeWeight(3)
                fill('#da0063')
                stroke('#da0063')
                rect((i * 100) +xoffset -2000, (j * 100) + yoffset-2000, 100, 100)
              }
            }
          }


          if (currentgun == skinslist[skinnum].primary) {
            image(eval(weapons[skinslist[skinnum].primary].name), width - 150, height - 325, eval(weapons[skinslist[skinnum].primary].name).width * 1.5, eval(weapons[skinslist[skinnum].primary].name).height * 1.5);
          }
          else {
            image(eval(weapons[skinslist[skinnum].primary].name), width - 150, height - 325);
          }
          if (currentgun == skinslist[skinnum].secondary) {
            image(eval(weapons[skinslist[skinnum].secondary].name), width - 150, height - 225, eval(weapons[skinslist[skinnum].secondary].name).width * 1.5, eval(weapons[skinslist[skinnum].secondary].name).height * 1.5);
          }
          else {
            image(eval(weapons[skinslist[skinnum].secondary].name), width - 150, height - 225);
          }

          if (currentgun == skinslist[skinnum].tertiary) {
            image(eval(weapons[skinslist[skinnum].tertiary].name), width - 150, height - 125, eval(weapons[skinslist[skinnum].tertiary].name).width * 1.5, eval(weapons[skinslist[skinnum].tertiary].name).height * 1.5);
          }
          else {
            image(eval(weapons[skinslist[skinnum].tertiary].name), width - 150, height - 125);
          }


          

          let fps = frameRate();
          fill(255);
          stroke(0);
          textSize(15)
          text(fps.toFixed(0) + "FPS", 35, height - 10);

          textSize(40)
          if (weapons[currentgun].maxammo >= 999) {
            text("  ∞", width - 90, height - 25)
            textSize(20)
            text("/∞", width - 50, height - 25)
          }
          else {
            if (weapons[currentgun].ammo >= 10) {
              text(weapons[currentgun].ammo, width - 90, height - 25)
            }
            else {
              text("  " + weapons[currentgun].ammo, width - 90, height - 25)
            }
            textSize(20)
            text("/" + weapons[currentgun].maxammo, width - 50, height - 25)
          }
        }
      }
    }
  }


  if (dead == 1) {
    changeTitle("CUBYSM 💀")
    nameField.position((100) - 50, height / 2 - 125)
    if (nameField.value() != "") {
      username = nameField.value()
    }
    else {
      username = skinslist[skinnum].fullname
    }
    noTint()
    fill('white')
    image(death, 0, 0, 10000, 10000)
    textAlign(CENTER);


    textSize(25)


    image(titlepic, width / 2, 175, 600, 200);
    image(spawnpic, width / 2, height / 2 + 150, 400, 100);


    // text('SPACE to spawn', width/2, height/2-140)

    imageMode(CENTER)
    direction = "front"
    angle = mouseX - (width / 2)

    if (angle > 100) { direction = "frontright" }
    else if (angle < -100) { direction = "frontleft" }
    else { direction = "front" }

    image(eval(skin + sub + direction), width / 2, height / 2, eval(skin + sub + direction).width * 2, eval(skin + sub + direction).height * 2);


    if ((width / 2) + 150 < mouseX && (width / 2) + 250 > mouseX && (height / 2) - 50 < mouseY && mouseY < (height / 2) + 50 && !mouseIsPressed) {
      image(arrowgone, width / 2 + 200, height / 2);
    }
    else {
      image(arrow, width / 2 + 200, height / 2);
    }

    push()
    scale(-1, 1);
    if ((width / 2 - 150) > mouseX && (width / 2 - 250) < mouseX && (height / 2) - 50 < mouseY && mouseY < (height / 2) + 50 && !mouseIsPressed) {
      image(arrowgone, -(width / 2 - 200), height / 2,);
    }
    else {
      image(arrow, -(width / 2 - 200), height / 2,);
    }
    pop()



    image(eval(weapons[skinslist[skinnum].primary].name+"tile"), (width/2)-104, height - 125);
    image(eval(weapons[skinslist[skinnum].secondary].name+"tile"), (width/2)+104, height - 125);

    // image(eval(weapons[skinslist[skinnum].primary].name + "tile"), (width / 2) - 208, height - 125);
    // image(eval(weapons[skinslist[skinnum].secondary].name + "tile"), (width / 2), height - 125);
    // image(eval(weapons[skinslist[skinnum].tertiary].name + "tile"), (width / 2) + 208, height - 125);

  }

  image(cursor, mouseX, mouseY)

}

function mouseWheel(event) {
  if (event.delta > 0) {
    if (currentgun == skinslist[skinnum].primary) {
      currentgun = skinslist[skinnum].secondary
    }
    else if (currentgun == skinslist[skinnum].secondary) {
      currentgun = skinslist[skinnum].tertiary
    }
    else {
      currentgun = skinslist[skinnum].primary
    }
    clearTimeout(reloadtimerid)
    reloading = 0
    return false;
  }
  else {
    if (currentgun == skinslist[skinnum].primary) {
      currentgun = skinslist[skinnum].tertiary
    }
    else if (currentgun == skinslist[skinnum].tertiary) {
      currentgun = skinslist[skinnum].secondary
    }
    else {
      currentgun = skinslist[skinnum].primary
    }
    clearTimeout(reloadtimerid)
    reloading = 0
    return false;
  }
}

setInterval(function myFunction() {
  socket.volatile.emit("move", { name: username, xvel: myposx, yvel: myposy, id: id, dir: direction, gundir: weaponrotation, flipgun: flipgun, suicide: suicide, currentgun: currentgun, skin: skin });
  if (delay < weapons[currentgun].speed) {
    delay += 1
    if (weapons[currentgun].auto == true && mouseIsPressed && mouseButton == LEFT && reloading == false) {
      shoot()
    }
  };
}, 1000 / 60);

socket.on("updatepositions", function (x) {
  if (id == 99) {
    id = x.length
    len += 1
  }
  len = x.length
  positions = x
})

socket.on("playdatgunsfx", function (y) {
  eval(y).play()
})
