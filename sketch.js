//player1 Bluetooth Setup Variables
let p1ServiceUuid = "8EF0E0A7-1807-4458-882D-74899FD040A2";
let p1SwitchCountUuid = "5EE04DE8-22B1-4227-BC09-20D564410F5D";
let p1AccelCountUuid = "0CBE7D9E-707E-422E-8803-B1F9D27A830C";
let p1AccelCharacteristic;
let p1SwitchCharacteristic;
let p1AccelValue = 0;
let p1SwitchValue = false;
let player1BLE;
let p1CharNum;

//Player2 Bluetooth Setup Variables
let p2ServiceUuid = "B64E61EA-EAE3-4549-99C4-126C66272F59";
let p2SwitchCountUuid = "53308B5A-D3D1-4F4B-A10F-90970E242C12";
let p2AccelCountUuid = "3FFF957B-BE12-45FC-8F2F-F2596A5D638C";
let p2AccelCharacteristic;
let p2SwitchCharacteristic;
let p2AccelValue = 0;
let p2SwitchValue = false;
let player2BLE;
let p2CharNum;

let timer = 5;
let song;
let mode = 0;
let penguinMove = 0;
let chickenMove = 0;
let repeatingScreen2 = false;
let ending = false;
let firstTime = true;
let wingFlapsFinal = 50;

let connectP1Button;
let connectP2Button;
let resetButton;


function preload() {
  img1 = loadImage("images/peng.png");
  img2 = loadImage("images/chucj.png");
  grid = loadImage("images/grid.jpg");
  myFont = loadFont("Ldfcomicsans-jj7l.ttf");
  song = loadSound("Squid Game Main Theme Soundtrack _ Way Back Then _ Netflix OST.mp3");
}

function setup() {
  // Create a p5ble class
  p1ServiceUuid = p1ServiceUuid.toLowerCase();
  p2ServiceUuid = p2ServiceUuid.toLowerCase();
  player1BLE = new p5ble();
  player2BLE = new p5ble();

  connectP1Button = createButton("Player 1");
  connectP1Button.center();
  connectP1Button.position(windowWidth / 2.2, windowHeight / 1.8);
  connectP1Button.mousePressed(connectToP1Ble);
  connectP2Button = createButton("Player 2");
  connectP2Button.center();
  connectP2Button.position(windowWidth / 1.8, windowHeight / 1.8);
  connectP2Button.mousePressed(connectToP2Ble);
  resetButton = createButton("Restart");
  resetButton.hide();
  resetButton.position(windowWidth / 2, windowHeight / 1.8);
  resetButton.mousePressed(resetGame);

  createCanvas(windowWidth, windowHeight);
  textFont(myFont);
  song.loop();
}

function connectToP1Ble() {
  // Connect to a device by passing the service UUID
  player1BLE.connect(p1ServiceUuid, gotP1Characteristics);
}


function connectToP2Ble() {
  // Connect to a device by passing the service UUID
  player2BLE.connect(p2ServiceUuid, gotP2Characteristics);
}

// A function that will be called once got characteristics
function gotP1Characteristics(error, characteristics) {
  if (error) console.log("error: ", error);
  console.log("characteristics: ", characteristics);
  for (let i = 0; i < characteristics.length; i++) {
    if (characteristics[i].uuid == p1AccelCountUuid.toLowerCase()) {
      p1CharNum = i;
      console.log(`Accel Number ${i} is working`);
      console.log(characteristics[i].uuid);
      p1AccelCharacteristic = characteristics[p1CharNum];
    } else {}
    if (characteristics[i].uuid == p1SwitchCountUuid.toLowerCase()) {
      p1CharNum = i;
      console.log(`Switch Number ${i} is working`);
      console.log(characteristics[i].uuid);
      p1SwitchCharacteristic = characteristics[p1CharNum];
    } else {
      continue;
    }
    player1BLE.read(p1AccelCharacteristic, gotP1AccelValue);
    //player1BLE.read(p1SwitchCharacteristic, gotP1SwitchValue);
  }
}

function gotP2Characteristics(error, characteristics) {
  if (error) console.log("error: ", error);
  console.log("characteristics: ", characteristics);
  for (let i = 0; i < characteristics.length; i++) {
    if (characteristics[i].uuid == p2AccelCountUuid.toLowerCase()) {
      p2CharNum = i;
      console.log(`Accel Number ${i} is working`);
      console.log(characteristics[i].uuid);
      p2AccelCharacteristic = characteristics[p2CharNum];
    } else {}
    if (characteristics[i].uuid == p2SwitchCountUuid.toLowerCase()) {
      p2CharNum = i;
      console.log(`Switch Number ${i} is working`);
      console.log(characteristics[i].uuid);
      p2SwitchCharacteristic = characteristics[p2CharNum];
    } else {
      continue;
    }
    if (ending != true) {
      player2BLE.read(p2AccelCharacteristic, gotP2AccelValue);
      //player2BLE.read(p2SwitchCharacteristic, gotp2SwitchValue);
    }
  }
}

// A function that will be called once got values
function gotP1AccelValue(error, value) {
  if (error) console.log("error: ", error);
  //console.log("p1AccelValue: ", value);
  p1AccelValue = value;
  player1BLE.read(p1AccelCharacteristic, gotP1AccelValue);
}

function gotP1SwitchValue(error, value) {
  if (error) console.log("error: ", error);
  //console.log("p1SwitchValue: ", value);
  p1SwitchValue = value;
  player1BLE.read(p1SwitchCharacteristic, gotP1SwitchValue);
}

function gotP2AccelValue(error, value) {
  if (error) console.log("error: ", error);
  //console.log("p1AccelValue: ", value);
  p2AccelValue = value;
  player2BLE.read(p2AccelCharacteristic, gotP2AccelValue);
}

function gotp2SwitchValue(error, value) {
  if (error) console.log("error: ", error);
  //console.log("p1SwitchValue: ", value);
  p2SwitchValue = value;
  player2BLE.read(p2SwitchCharacteristic, gotp2SwitchValue);
}

function draw() {
  if (!ending) {

    background(255);
  }
  if (mode == 0) {
    screen0();
  } else if (mode == 1) {
    connectP1Button.hide();
    connectP2Button.hide();
    resetButton.hide();
    screen1();
  } else if (mode == 2) {
    screen2();
  }
}

function screen0() {
  if (player2BLE.isConnected() && player2BLE.isConnected()) {
    mode = 1;
    clear();
  } else {
    push();
    background(255);
    textSize(windowWidth * 0.05);
    textAlign(CENTER);
    text("waiting players to connect...", windowWidth / 2, windowHeight / 2);
    pop();
  }
}

function screen1() {
  push();
  background(255);

  textSize(windowWidth * 0.1);
  textAlign(CENTER);
  text(timer, windowWidth / 2, windowHeight / 1.8 + windowWidth * 0.05);

  if (frameCount % 125 == 0 && timer > 0) {
    timer--;
    pop();
  }
  if (timer == 0) {
    mode = 2;
    //ready set go

  } else if (timer == 4) {
    text("get your wings ready", windowWidth / 2, windowHeight / 2.2 - windowWidth * 0.05);
  } else if (timer == 3) {
    text("ready", windowWidth / 2, windowHeight / 2.2 - windowWidth * 0.05);
  } else if (timer == 2) {
    text("set", windowWidth / 2, windowHeight / 2.2 - windowWidth * 0.05);
  } else if (timer == 1) {
    text("fly!", windowWidth / 2, windowHeight / 2.2 - windowWidth * 0.05);
  }

}

function screen2() {
  if (!ending && !repeatingScreen2) {
    resetGameStart();
    repeatingScreen2 = true;
  }
  if (!ending) {
    //grid lines
    push();
    stroke("#D1D2F9");
    for (let i = 0; i < 1; i += 0.05) {
      line(0, windowHeight - windowHeight * i, windowWidth, windowHeight - windowHeight * i);
      line(windowWidth - windowWidth * i, 0, windowWidth - windowWidth * i, windowHeight);
    }
    pop();

    //start line 
    push();
    strokeWeight(5);
    stroke(255, 0, 0);
    line(windowWidth * 0.05, 0, windowWidth * 0.05, windowHeight);
    //finish line
    line(windowWidth * 0.95, 0, windowWidth * 0.95, windowHeight);
    pop();
  }

  //penguin
  push();

  //change mouseX to flaps
  imageMode(CENTER);
  penguinMove = map(p1AccelValue, 0, wingFlapsFinal, windowWidth * 0.04, windowWidth * 0.96);
  image(img1, penguinMove, windowHeight * 0.3, windowWidth * 0.1, windowWidth * 0.1);
  //console.log(penguinMove);
  if (penguinMove >= windowWidth * 0.95 && ending == false) {
    resetButton.show();
    textAlign(CENTER);
    textSize(windowWidth * 0.1);
    fill("#003cff");
    text("Penguin wins!", windowWidth / 2, windowHeight / 2);
    song.pause();
    pop();
    ending = true;
  }

  //chikcen
  push();
  imageMode(CENTER);
  chickenMove = map(p2AccelValue, 0, wingFlapsFinal, windowWidth * 0.04, windowWidth * 0.96);
  //console.log(chickenMove);
  image(img2, chickenMove, windowHeight * 0.7, windowWidth * 0.1, windowWidth * 0.1);
  if (chickenMove >= windowWidth * 0.95 && ending == false) {
    resetButton.show();
    textAlign(CENTER);
    textSize(windowWidth * 0.1);
    fill("#ff8400");
    text("Chicken wins!", windowWidth / 2, windowHeight / 2);

    song.pause();
    pop();
    ending = true;
  }
}

async function resetGame() {
  const inputValue = true;
  const writeP1 = await player1BLE.write(p1SwitchCharacteristic, inputValue);
  const writeP2 = await player2BLE.write(p2SwitchCharacteristic, inputValue);
  clear();
  timer = 5;
  penguinMove = 0;
  chickenMove = 0;
  ending = false;
  repeatingScreen2 = false;
  mode = 1;
  //player1BLE.disconnect();
  //player2BLE.disconnect();
}

async function resetGameStart() {
  const inputValue = true;
  const writeP1 = await player1BLE.write(p1SwitchCharacteristic, inputValue);
  const writeP2 = await player2BLE.write(p2SwitchCharacteristic, inputValue);
  clear();
  penguinMove = 0;
  chickenMove = 0;
  ending = false;
  //player1BLE.disconnect();
  //player2BLE.disconnect();
}