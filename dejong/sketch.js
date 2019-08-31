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

        cellController.className = "cell-controller";
        cellControllerText.className = "text";
        cellControllerText.innerHTML = "Hola";
        cellController.appendChild(cellControllerText);
        document
          .getElementById(`canvas-container-${i}-${j}`)
          .appendChild(cellController);

        p.background(235);
        p.stroke("rgba(0, 0, 0, .4)");
        p.noFill();
      };

      p.draw = () => {
        let attractor = getAttractorPoints(p);
        cellControllerText.innerHTML = `a = ${attractor.a.toFixed(
          8
        )};<br>b = ${attractor.b.toFixed(8)};<br>c = ${attractor.c.toFixed(
          8
        )};<br>d = ${attractor.d.toFixed(8)};`;
        for (let i = 0; i < attractor.points.length; i++) {
          p.circle(
            CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].x,
            CELL_SIZE / 2 + (CELL_SIZE / 2) * attractor.points[i].y,
            0.2
          );
        }
      };

      p.test = `
        console.log("aaah, troliau we, soy el yoyos xd", ${i}, ${j});
        ${p.background.toString()}
      `;

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
          cellControllerText.innerHTML = `
        <div class = "attractor-variables">
        <div class = "attractor-variable-controller">
          <div class = "attractor-variable">
          a =
          </div>
          <div class = "value-controller">

          <div class = "current-value">
          ${attractor.a<0?attractor.a.toFixed(7):attractor.a.toFixed(8)}
            </div>
            <div class = "decrease-value">
              <i class="fas fa-arrow-down button"></i>
            </div>
            <div class = "increase-value">
              <i class="fas fa-arrow-up button"></i>
            </div>
            
          </div>
        </div>

        <div class = "attractor-variable-controller">
        <div class = "attractor-variable">
        b =
        </div>
        <div class = "value-controller">

          <div class = "current-value">
          ${attractor.b<0?attractor.b.toFixed(7):attractor.b.toFixed(8)}
          </div>
          <div class = "decrease-value">
            <i class="fas fa-arrow-down button"></i>
          </div>
          <div class = "increase-value">
            <i class="fas fa-arrow-up button"></i>
          </div>
          
        </div>
      </div>
      <div class = "attractor-variable-controller">
      <div class = "attractor-variable">
      c =
      </div>
      <div class = "value-controller">

        <div class = "current-value">
        ${attractor.c<0?attractor.c.toFixed(7):attractor.c.toFixed(8)}
        </div>
        <div class = "decrease-value">
          <i class="fas fa-arrow-down button"></i>
        </div>
        <div class = "increase-value">
          <i class="fas fa-arrow-up button"></i>
        </div>
        
      </div>
    </div>
    <div class = "attractor-variable-controller">
    <div class = "attractor-variable">
    d =
    </div>
    <div class = "value-controller">

      <div class = "current-value">
      ${attractor.d<0?attractor.d.toFixed(7):attractor.d.toFixed(8)}
      </div>
      <div class = "decrease-value">
        <i class="fas fa-arrow-down button"></i>
      </div>
      <div class = "increase-value">
        <i class="fas fa-arrow-up button"></i>
      </div>
      
    </div>
  </div>
</div>
          <div class="buttons">
              <i class="fas fa-unlock button"></i>
              <i class="far fa-copy fa-lg button"></i>
              <i class="fas fa-redo-alt fa-lg button"></i>
              <i class="fas fa-plus fa-lg button"></i>
          </div >

          `;
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
