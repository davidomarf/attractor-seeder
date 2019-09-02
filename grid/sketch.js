const CELL_SIZE = parseInt(query.size);
const ATTRACTOR_POINTS = parseInt(query.points);

let cellsMeta = {};
let cells = [];

function drawCanvases() {
  for (let i = 0; i < canvases.length; i++) {
    for (let j = 0; j < canvases[i].length; j++) {
      let canvasElement = document.getElementById(`canvas-container-${i}-${j}`);
      if (canvasElement.getAttribute("isLocked") === "true") continue;
      if (canvasElement.lastChild.tagName === "CANVAS") {
        canvasElement.removeChild(canvasElement.lastChild);
      }

      let attractorCanvas = function(p) {
        let canvasElement = document.getElementById(
          `canvas-container-${i}-${j}`
        );
        if (canvasElement.getAttribute("isLocked") === "true") return;
        let values;
        p.setup = () => {
          values = canvasElement.getAttribute("attractor-values").split(",");
          let square = p.createCanvas(CELL_SIZE, CELL_SIZE);

          square.parent(canvasElement);
          square.id(`canvas-${i}-${j}`);
          p.noLoop();

          p.background(235);
          p.stroke("rgba(0, 0, 0, .4)");
          p.noFill();
        };

        p.draw = () => {
          let attractor = getAttractorPoints(p, values);
          for (let i = 0; i < attractor.points.length; i++) {
            p.point(
              p.round(CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].x),
              p.round(CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].y)
            );
          }
        };
      };

      new p5(attractorCanvas, `canvas-container-${i}-${j}`);
    }
  }
}
function getAttractorPoints(p, values) {
  let x = 0;
  let y = 0;

  let a = values[0];
  let b = values[1];
  let c = values[2];
  let d = values[3];

  let points = [];

  for (let i = 0; i < ATTRACTOR_POINTS; i++) {
    // let xt = sin(a * y) + c * cos(a * x);
    // let yt = sin(b * x) + d * cos(b * y);
    // let xt = p.sin(a * y) - p.cos(b * x);
    // let yt = p.sin(c * x) - p.cos(d * y);
    let next = attractorEquation.next(a, b, c, d, x, y);
    x = next.x;
    y = next.y;
    points.push({ x: x, y: y});
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

drawCanvases();
