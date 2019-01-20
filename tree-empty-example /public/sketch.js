///////////variable declarations////////////////////////
let socket; // socket lib allows one user to draw and another see the drawing
// tree features
let s = 0; // scale
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
let url = `http://api.openweathermap.org/data/2.5/weather?q=Seattle,us&units=metric&APPID=f2038a35dbc40be211675c09ae73bd2a`

// weather
let currentWindSpeed;
let currentWindDeg;
let currentCity;
let currentTempreture;
let currentWeather;

// wind
let wind;
let windPosition; // position of wind objects
let angleW;
//   wind = p5.Vector.fromAngle(angle);


// sliders
let angleSlider, coefSlider, lSlider, branchesSlider, stepsSlider;

/// collects rain drops
let nDrops = 1000;
let drops = [];

// flock
let flock;

function preload() {
  weatherAsk(); // calls api and gets weather
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textSize(20);

  // create raindrops
  for (i = 0; i < nDrops; i++) {
    drops.push(new Drop());
  }

  // wind direction
  wind = createVector();
  windPosition = createVector(width, height);// where wind object starts moving from

  // create flock and add boids to them
  flock = new Flock();

  // Add an initial set of boids into the system
  if (currentWindSpeed) {
    for (var i = 0; i < 100; i++) {
      var b = new Boid(width/2,height/2, wind, windPosition);
      flock.addBoid(b);
    }
  }
}


function draw() {
  background(255);
  count++;

  showWeather();

//  start rain
  if (currentWeather === "Rain") {
    drops.forEach(function(d) {
     d.drawAndDrop();
    });
  }

// draw tree
  push();
    stroke(255);
    translate(width/2, height-100);
    let branch = new Branch(len, steps);
    branch;
  pop();


// draw wind
push();
  windPosition.add(wind);
  stroke(0);
  fill(51);
  ellipse(windPosition.x,windPosition.y,100,100);
pop();

// keeps it in the sreen
if (windPosition.x > width)  windPosition.x = 0;
if (windPosition.x < 0)      windPosition.x = width;
if (windPosition.y > height) windPosition.y = 0;
if (windPosition.y < 0)      windPosition.y = height;
}

// draw wind 2
// flock.run();

// weather details
function showWeather() {
  push();
    textSize(50)
    noStroke();
    text(`${currentWindSpeed} mph`,20,70);
  pop();

  push();
    textSize(20)
    noStroke();
    text(`${currentWeather}`,21, 95);
  pop();

  push();
    textSize(20)
    noStroke();
    text(`${currentCity}`,21,120);
  pop();

  push();
    textSize(20)
    noStroke();
    text(`${currentTempreture}°C`,21,145);
  pop();

  // wind direction arrow compass
  push();
  translate(32, height - 32);
  rotate(wind.heading() + PI/2); // Rotate by the wind's angle
  noStroke();
  fill(255);

  stroke(45, 123, 182);
  strokeWeight(3);
  line(0, -16, 0, 16);

  noStroke();
  fill(45, 123, 182);
  triangle(0, -18, -6, -10, 6, -10);
  pop();
  }

  function randomizeBackground() {
    // bgColor = color(round(random(255)), round(random(0, 100)), 255);
  }

function mousePressed() {
  weatherAsk();
  flock.addBoid(new Boid(mouseX,mouseY));
}

// geting weather data
function weatherAsk() {
  loadJSON(url, gotData);
}

function gotData(data) {
  weather = data;
  currentWeather = weather.weather[0].main;
  currentWindSpeed = weather.wind.speed;
  currentWindDeg = weather.wind.deg;
  currentTempreture = weather.main.temp;
  currentCity = weather.name;

  let angle = radians(currentWindDeg);
  wind = p5.Vector.fromAngle(angle);
}
