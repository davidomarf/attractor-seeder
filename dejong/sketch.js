const CELL_SIZE = parseInt(query.size);
const ATTRACTOR_POINTS = parseInt(query.points);

let cellsMeta = {};
let cells = [];

for (let i = 0; i < canvases.length; i++) {
  for (let j = 0; j < canvases[i].length; j++) {
    let attractorCanvas = function(p) {
      let cellController = document.createElement("div");
      let cellControllerText = document.createElement("div");

      p.setup = () => {
        let square = p.createCanvas(CELL_SIZE, CELL_SIZE);

        square.parent(`canvas-container-${i}-${j}`);
        square.id(`canvas-${i}-${j}`);
        p.noLoop();

        p.background(235);
        p.stroke("rgba(0, 0, 0, .4)");
        p.noFill();
      };

      p.draw = () => {
        let attractor = getAttractorPoints(p);
        for (let i = 0; i < attractor.points.length; i++) {
          p.circle(
            CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].x,
            CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].y,
            0.2
          );
        }
      };

      p.mouseClicked = () => {
        if (
          p.mouseX > 0 &&
          p.mouseX < CELL_SIZE &&
          p.mouseY > 0 &&
          p.mouseY < CELL_SIZE
        ) {
          p.background(235);
          let attractor = getAttractorPoints(p);
          copyStringToClipboard(
            `let a = ${attractor.a}, b = ${attractor.b}, c = ${attractor.c}, d = ${attractor.d};`
          );
          for (let i = 0; i < attractor.points.length; i++) {
            p.circle(
              CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].x,
              CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].y,
              0.2
            );
          }
        }
      };
    };

    new p5(attractorCanvas, `canvas-container-${i}-${j}`);
  }
}

function getAttractorPoints(p) {
  let x = 0;
  let y = 0;

  let a = p.random(-2, 2);
  let b = p.random(-2, 2);
  let c = p.random(-2, 2);
  let d = p.random(-2, 2);

  let points = [];
  for (let i = 0; i < ATTRACTOR_POINTS; i++) {
    // let xt = sin(a * y) + c * cos(a * x);
    // let yt = sin(b * x) + d * cos(b * y);
    let xt = p.sin(a * y) - p.cos(b * x);
    let yt = p.sin(c * x) - p.cos(d * y);
    x = xt;
    y = yt;
    points.push({ x: xt, y: yt });
  }

  let maxValue = 2;

  points = points.map(e => {
    return { x: e.x / maxValue, y: e.y / maxValue };
  });

  return { points: points, a: a, b: b, c: c, d: d };
}

function copyStringToClipboard(str) {
  // Create new element
  var el = document.createElement("textarea");
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand("copy");
  // Remove temporary element
  document.body.removeChild(el);
}
