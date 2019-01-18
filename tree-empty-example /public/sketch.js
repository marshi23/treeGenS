let socket;
let s = 0; // scale
let isOverCircle;

// tree features
let angle = 0.7853981634;
let coef = 0.5;
let len = 200;
let branches;
let steps = 6
let count = 0;
let flowerChance;
let bgColor;

// weather api call
let apiKey; // how do i import from .env file?
let cityName;
let countryCode;
let units='&cnt=16&units=metric';
let cnt = 2;
let weather;
let url = `http://api.openweathermap.org/data/2.5/weather?q=Seattle,us&units=metric&APPID=f2038a35dbc40be211675c09ae73bd2a`
let weatherButtom;

// wind
let rotRange = 10;
let time = 0;
let currentWindSpeed;
let currentCity;
let currentTempreture;

// sliders
let angleSlider, coefSlider, lSlider, branchesSlider, stepsSlider;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textSize(20);

  createSliders(); // sliders

  randomize();
  reset();
}

function draw() {
  background(bgColor);

  // sliders
  angle = angleSlider.value();
  coef = coefSlider.value();
  // l = lSlider.value();
  // branches = branchesSlider.value();
  // steps = stepsSlider.value();

  weatherButtom = createButton('weather');
  weatherButtom.position(width-100, height-100);
  // button.mousePressed();

  // slider display
  noStroke();
  fill(255);
  // text(`Current Wind Speed: ${round(currentWindSpeed)}mph`,20,height-210);
  text("How open are the branches?",20,height-165); // angle
  text("How long should the branches be?",20,height-90); // coef
  // text("How tall is the tree feeling?",165,height-85); // l
  // text("How many branches is the tree connecting?",165,height-50); // branches
  // text("How many steps has the tree reached?",165,height-15); // steps


  if (time > 600) {
    time = 0;
    randomize();
    flowerChance = 0.1;
    reset();
  }

    stroke(255);
    translate(width/2, height-100);
    let branch = new Branch(len, steps, angle, rotRange, currentWindSpeed);
    branch;

    let distance = dist(mouseX, mouseY, weatherButtom.x, weatherButtom.y);

    // if the distance is less than the circle's radius
    if (distance < 50) {
      isOverCircle = true;
    } else {
      isOverCircle = false;
    }

  }

  // function showWeather() {
  //   console.log(`in showWeather`)
  //     // fill(255);
  //     text(`City | ${currentCity}`,720,height-100);
  //     text(`Tempreture | ${currentTempreture}`,720,height-300);
  //     text(`Wind | ${currentWindSpeed}`,720,height-200);
  // }

  function  randomize() {
    rotRange = random(20, 60);
    randomizeBackground();
  }

  function randomizeBackground() {
    bgColor = color(round(random(255)), round(random(0, 100)), 255);
  }

function mousePressed() {
  console.log('mouse pressed')
  time = 0;
  randomize();
  reset();
  weatherAsk();

  if (isOverCircle)  {
    text(`City | ${currentCity}`,0,0);
    text(`Tempreture | ${currentTempreture}`,720,height-300);
    text(`Wind | ${currentWindSpeed}`,720,height-200);
  }


}

function reset() {
  background(bgColor);
};

// geting weather data
function weatherAsk() {
  loadJSON(url, gotData);
}

function gotData(data) {
  weather = data;
  currentWindSpeed = weather.wind.speed;
  currentTempreture = weather.main.temp;
  currentCity = weather.name;
}

// create sliders
function createSliders() {
  angleSlider = createSlider(0, 3.1415926536, 0.7853981636, 0.05);
  angleSlider.position(20, height-150);

  coefSlider = createSlider(0, 0.75, 0.5, 0.05);
  coefSlider.position(20, height-70);

  // lSlider = createSlider(50, 450, 300, 50);
  // lSlider.position(20, height-85);

  // branchesSlider = createSlider(1, 3, 1, 1);
  // branchesSlider.position(20, height-50);
  //
  // stepsSlider = createSlider(1, 10, 6, 1);
  // stepsSlider.position(20, height-15);
}
