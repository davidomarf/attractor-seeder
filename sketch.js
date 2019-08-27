const CELL_SIZE = 300;

let cellsMeta = {};
let cells = [];

function setup() {
  createCanvas(windowWidth - 10, windowHeight - 10);
  background("black");

  cellsMeta = {
    cols: floor(width / CELL_SIZE),
    rows: floor(height / CELL_SIZE)
  };

  cellsMeta.colsMargin = round((width % CELL_SIZE) / (cellsMeta.cols + 1));
  cellsMeta.rowsMargin = round((height % CELL_SIZE) / (cellsMeta.rows + 1));

  noLoop();
}

function drawCells(cells) {
  push();
  fill(255);
  for (let i = 0; i < cells.length; i++) {
    rect(cells[i].x_zero, cells[i].y_zero, CELL_SIZE, CELL_SIZE);
  }
  pop();
}

function draw() {
  for (let i = 0; i < cellsMeta.cols; i++) {
    for (let j = 0; j < cellsMeta.rows; j++) {
      cells.push({
        x_zero: (i + 1) * cellsMeta.colsMargin + i * CELL_SIZE,
        y_zero: (j + 1) * cellsMeta.rowsMargin + j * CELL_SIZE
      });
    }
  }

  drawCells(cells);

  push();

  stroke("rgba(0, 0, 0, .4)");
  noFill();

  for (let i = 0; i < cells.length; i++) {
    let attractor = getAttractorPoints();
    for (let j = 0; j < attractor.points.length; j++) {
      circle(
        cells[i].x_zero +
          CELL_SIZE / 2 +
          (CELL_SIZE / 2) * attractor.points[j].x,
        cells[i].y_zero +
          CELL_SIZE / 2 +
          (CELL_SIZE / 2) * attractor.points[j].y,
        0.2
      );
    }
  }
  pop();
}

function getAttractorPoints() {
  let x = 0;
  let y = 0;
  
  let a = random(-2, 2);
  let b = random(-2, 2);
  let c = random(-2, 2);
  let d = random(-2, 2);


  let points = [];
  for (let i = 0; i < 10000; i++) {
    // let xt = sin(a * y) + c * cos(a * x);
    // let yt = sin(b * x) + d * cos(b * y);
    let xt = sin(a * y) - cos(b * x);
    let yt = sin(c * x) - cos(d * y);
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

function mouseClicked(){
  console.log(mouseX, mouseY)
  console.log(cellsMeta)
  // let cell = cells[]
}