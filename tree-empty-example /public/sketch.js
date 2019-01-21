//// adding tree test
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
let windAngle;

/// rain
let nDrops = 1000;
let drops = [];

// flock
let flock;

//Mountains
let mountains;
let time;

// text
let graphics;

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
      var b = new Boid(width/2,height/2);
      flock.addBoid(b);
    }
  }

  time = random(1);
  mountains = new Mountains(height - 100, height - 10, time);

}


function draw() {
  background(255);
  count++;
  showWeather();

//  start rain
  push();
  if (currentWeather === "Rain") {
    drops.forEach(function(d) {
     d.drawAndDrop();
    });
  }
  pop();

// draw mountain
// push();
// mountains.draw();
// pop();

// draw tree
  // push();
  //   stroke(255);
  //   translate(width/2, height-100);
  //   let branch = new Branch(len, steps);
  //   branch;
  // pop();


// draw wind 1 : circle
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

// draw wind 2 : boids
push();
  flock.run();
pop();
}


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

  windAngle = radians(currentWindDeg);
  wind = p5.Vector.fromAngle(angle);
}

function Boid(x,y) {

  this.acceleration = createVector(0,0);
  this.velocity =  createVector(random(-1,1),random(-1,1)); // currentWindSpeed
  this.position = createVector(x,y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = currentWindSpeed;//0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules

// windPosition.add(wind);
// this.velocity.add(this.acceleration);
function Boid(x,y) {
  // this.acceleration = createVector(0,0);
  this.acceleration = wind.copy();
  // this.velocity = createVector(random(-1,1),random(-1,1));
  this.velocity = windPosition.copy();
  this.position = createVector(x,y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  var sep = this.separate(boids);   // Separation
  var ali = this.align(boids);      // Alignment
  var coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}


// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(127);
  stroke(200);
  push();
  translate(this.position.x,this.position.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r*2);
  vertex(-this.r, this.r*2);
  vertex(this.r, this.r*2);
  endShape(CLOSE);
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width +this.r;
  if (this.position.y < -this.r)  this.position.y = height+this.r;
  if (this.position.x > width +this.r) this.position.x = -this.r;
  if (this.position.y > height+this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  var desiredseparation = 25.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every boid in the system, check if it's too close
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0,0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum,this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0,0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  var neighbordist = 50;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0,0);
  }
}
