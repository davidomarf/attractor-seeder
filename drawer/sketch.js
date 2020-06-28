// Read the URL params
let query = getQueryParams(document.location.search);
query = getDefaultsForEmptyFields(query);

// Set the title of the page
document.title = `${numberify(query.points)} points ${
  query.equations.charAt(0).toUpperCase() + query.equations.slice(1)
} attractor`;

function numberify(n) {
  const commas = Math.floor(Math.log10(n) / 3);
  const str = String(n / Math.pow(1000, commas));
  switch (commas) {
    case 0:
      return str;
    case 1:
      return str + "K";
    case 2:
      return str + "M";
    case 3:
      return str + "T";
    case 4:
      return str + "Q";
  }
}

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

// Specify the equations for Clifford and De Jong attractors
const CLIFFORD = (a, b, c, d, x, y) => {
  return {
    x: Math.sin(a * y) + c * Math.cos(a * x),
    y: Math.sin(b * x) + d * Math.cos(b * y)
  };
};

const DEJONG = (a, b, c, d, x, y) => {
  return {
    x: Math.sin(a * y) - Math.cos(b * x),
    y: Math.sin(c * x) - Math.cos(d * y)
  };
};

// Set the equations to use using the URL params
let attractorEquation =
  query.equations.toLowerCase() === "clifford" ? CLIFFORD : DEJONG;

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
      let next = attractorEquation(a, b, c, d, x, y);
      x = next.x;
      y = next.y;
      circle(
        WIDTH / 2 + (WIDTH / 2) * (x / maxValue),
        HEIGHT / 2 + (HEIGHT / 2) * (y / maxValue),
        0.5
      );
    }
    console.log(j / 10 + "%");
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
