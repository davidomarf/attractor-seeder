const CELL_SIZE = parseInt(query.size);
const ATTRACTOR_POINTS = parseInt(query.points);

let cellsMeta = {};
let cells = [];

for (let i = 0; i < canvases.length; i++) {
  for (let j = 0; j < canvases[i].length; j++) {
    let attractorCanvas = function(p) {
      p.setup = () => {
        let square = p.createCanvas(CELL_SIZE, CELL_SIZE);

        square.parent(`canvas-container-${i}-${j}`);
        square.id(`canvas-${i}-${j}`);
        p.noLoop();

        p.background(250);
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

// function mouseClicked(){
//   console.log(mouseX, mouseY)
//   console.log(cellsMeta)
//   // let cell = cells[]
// }
