let socket;
let angle = 0.7853981634;
let coef = 0.5;
let l = 200;
let branches;
let steps = 6
let count = 0;
let bgColor;


// weather api call
// how do i import from .env file?
let apiKey= 'f2038a35dbc40be211675c09ae73bd2a';
let cityName = 'cityname';
let countryCode = 'us';
let units='&cnt=16&units=metric';
let cnt = 2;
let weather;
let api=`api.openweathermap.org/data/2.5/forecast/daily?q=${cityName},${countryCode}&cnt=${cnt}`;
// let input = 'New York';


// wind
let rotRange = 10;
let time = 0;

// scale
s = 0;

// sliders
let angleSlider, coefSlider, lSlider, branchesSlider, stepsSlider;

// function preload() {
//   // url = "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22";
//
//   // axios({
//   //   method:'get',
//   //   url:'https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22',
//   //   headers: {'Access-Control-Allow-Origin': '*'},
//   // })
//   // .then((response) => {
//   //     console.log(response);
//   //     let wind = response.data.wind;
//   //     console.log(response);
//   //     // gotData(wind);
//   //   })
//   //   .catch((error) => {
//   //     console.log(error);
//   //   })
// }


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textSize(20);


  // make api call
  // input = createInput();
  // input.position(20, 65);
  //
  // button = createButton('submit');
  // button.position(width/2, 65);
  // button.mousePressed(weatherAsk);
  //
  //
  // button.mousePressed(weatherAsk);
  // // input = select('#city');
  // console.log(input);
  //
  // input = 'new york';


  // sliders
  angleSlider = createSlider(0, 3.1415926536, 0.7853981636, 0.05);
  angleSlider.position(20, height-165); // 175

  coefSlider = createSlider(0, 0.75, 0.5, 0.05);
  coefSlider.position(20, height-120); // 140

  lSlider = createSlider(50, 450, 300, 50);
  lSlider.position(20, height-85); // 105

  branchesSlider = createSlider(1, 3, 1, 1);
  branchesSlider.position(20, height-50); // 70

  stepsSlider = createSlider(1, 10, 6, 1);
  stepsSlider.position(20, height-15); // 35

  randomize();
  reset();
}

// geting weather data
function weatherAsk() {
  console.log('in ask');
  let url = api + input + apiKey + units;
  console.log(url);
  loadJSON(url, gotData);

}

//
function gotData(data) {
  weather = data;
  console.log(data);
  for(var i=0;i<weather.list.length;i++){
  var mintemp=weather.list[i].temp.min;
  var maxtemp=weather.list[i].temp.max;
  var eventemp=weather.list[i].temp.eve;
  minY[i]=map(mintemp,-5,40,height*0.8,0);
  maxY[i]=map(maxtemp,-5,40,height*0.8,0);
  evenY[i]=map(eventemp,-5,40,height*0.8,0);
  }

  for (var j = 0; j < 100; j++) {
    drop[j] = new Drop();
  }
}


function draw() {
  background(bgColor);

  // sliders
  angle = angleSlider.value();
  coef = coefSlider.value();
  l = lSlider.value();
  branches = branchesSlider.value();
  steps = stepsSlider.value();

  // slider display
  noStroke();
  fill(255);
  text("Wind Speed: ",20,height-210);
  text("How open are the branches?",165,height-165); // angle
  text("How long should the branches be?",165,height-120); // coef
  text("How tall is the tree feeling?",165,height-85); // l
  text("How many branches is the tree connecting?",165,height-50); // branches
  text("How many steps has the tree reached?",165,height-15); // steps


  if (time > 600)
  {
    time = 0;
    randomize();
    // flowerChance = 0.1;
    reset();
  }


  // create tree
    stroke(255);
    translate(width/2, height-100);
    let branch = new Branch(l, steps, angle, rotRange);
    branch;
  }


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
}

function reset() {
  background(bgColor);
};
