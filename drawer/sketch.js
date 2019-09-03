// Read the URL params
let query = getQueryParams(document.location.search);
query = getDefaultsForEmptyFields(query);

function getDefaultsForEmptyFields(query) {
  if (!query.equations)
    query.equations = Math.random() > 0.5 ? "clifford" : "dejong";
  if (!query.points) query.points = 1000000;
  if (!query.a) query.a = Math.random() * 4 - 2;
  if (!query.b) query.b = Math.random() * 4 - 2;
  if (!query.c) query.c = Math.random() * 4 - 2;
  if (!query.d) query.d = Math.random() * 4 - 2;
  if (!query.alpha) query.alpha = 0.1;
  if (!query.margin) query.margin = 200;
  return query;
}

const WIDTH = 2048;
const HEIGHT = 2048;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  noFill();
  strokeWeight(1);
  stroke(`rgba(0,0,0,${query.alpha})`);
  noLoop();
}

function draw() {
  let x = 0;
  let y = 0;

  let a = query.a,
    b = query.b,
    c = query.c,
    d = query.d;

  let maxValue = 2;
  if (query.equations.toLowerCase() == "clifford") {
    maxValue = 3;
  }

  let pointsPerPercentage = query.points / 1000;

  for (let j = 0; j < 1000; j++) {
    for (let i = 0; i < pointsPerPercentage; i++) {
      let xt = sin(a * y) + c * cos(a * x);
      let yt = sin(b * x) + d * cos(b * y);
      x = xt;
      y = yt;
      circle(
        WIDTH / 2 + (WIDTH / 2) * (x / maxValue),
        HEIGHT / 2 + (HEIGHT / 2) * (y / maxValue),
        .5
      );
    }
    console.log(j/10 + "%");
  }

  console.log("finished");
  console.log(`a = ${a},\nb = ${b},\nc = ${c},\nd = ${d};\n`);

}

/**
 * Return an object containing the parameters of an url query
 * @param {string} qs   URL to get the parameters from
 * @returns {Object}    Each pair key-value is a parameter
 */
function getQueryParams(qs) {
  qs = qs.split("+").join(" ");

  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while ((tokens = re.exec(qs))) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}
