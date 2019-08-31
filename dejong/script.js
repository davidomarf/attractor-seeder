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

function getCanvasBuilder(info) {
  let canvasSize = info.size ? info.size : 300;

  let canvasBuilder = {
    cols: Math.floor(window.innerWidth / canvasSize),
    rows: Math.floor(window.innerHeight / canvasSize)
  };

  canvasBuilder.colsMargin = Math.round(
    (window.innerWidth % canvasSize) / (canvasBuilder.cols + 1)
  );
  canvasBuilder.rowsMargin = Math.round(
    (window.innerHeight % canvasSize) / (canvasBuilder.rows + 1)
  );

  return canvasBuilder;
}

let query = getQueryParams(document.location.search);
let canvasBuilder = getCanvasBuilder(query);

let canvasSize = query.size;
let canvases = [];

for (let i = 0; i < canvasBuilder.rows; i++) {
  canvases.push([]);
  let div = document.createElement("div");
  div.className = "canvas-row";
  document.body.appendChild(div);
  for (let j = 0; j < canvasBuilder.cols; j++) {
    let cellDiv = document.createElement("div");
    cellDiv.id = `canvas-container-${i}-${j}`;
    cellDiv.width = canvasSize;
    cellDiv.height = canvasSize;
    cellDiv.className = "canvas-container";

    let cellController = document.createElement("div");
    let cellControllerText = document.createElement("div");

    cellController.className = "cell-controller";
    cellControllerText.className = "text";
    cellControllerText.innerHTML = "Hola";
    cellController.appendChild(cellControllerText);

    cellDiv.appendChild(cellController);

    let a = Math.random() * 4 - 2;
    let b = Math.random() * 4 - 2;
    let c = Math.random() * 4 - 2;
    let d = Math.random() * 4 - 2;
    cellControllerText.innerHTML = `
      <div class="attractor-variables">
      <div class="attractor-variable-controller">
        <div class="attractor-variable">
          a =
        </div>
        <div class="value-controller">
          <div class="current-value" id="a-value" value = ${a}>
            ${a < 0 ? a.toFixed(7) : a.toFixed(8)}
          </div>
          <div class="decrease-value">
            <i class="fas fa-arrow-down button"></i>
          </div>
          <div class="increase-value">
            <i class="fas fa-arrow-up button"></i>
          </div>
        </div>
      </div>

      <div class="attractor-variable-controller">
        <div class="attractor-variable">
          b =
        </div>
        <div class="value-controller">
          <div class="current-value">
            ${b < 0 ? b.toFixed(7) : b.toFixed(8)}
          </div>
          <div class="decrease-value">
            <i class="fas fa-arrow-down button"></i>
          </div>
          <div class="increase-value">
            <i class="fas fa-arrow-up button"></i>
          </div>
        </div>
      </div>
      <div class="attractor-variable-controller">
        <div class="attractor-variable">
          c =
        </div>
        <div class="value-controller">
          <div class="current-value">
            ${c < 0 ? c.toFixed(7) : c.toFixed(8)}
          </div>
          <div class="decrease-value">
            <i class="fas fa-arrow-down button"></i>
          </div>
          <div class="increase-value">
            <i class="fas fa-arrow-up button"></i>
          </div>
        </div>
      </div>
      <div class="attractor-variable-controller">
        <div class="attractor-variable">
          d =
        </div>
        <div class="value-controller">
          <div class="current-value">
            ${d < 0 ? d.toFixed(7) : d.toFixed(8)}
          </div>
          <div class="decrease-value">
            <i class="fas fa-arrow-down button"></i>
          </div>
          <div class="increase-value">
            <i class="fas fa-arrow-up button"></i>
          </div>
        </div>
      </div>
      </div>
      <div class="buttons">
      <i class="fas fa-unlock fa-lg button"></i>
      <i class="far fa-copy fa-lg button"></i>
      <i class="fas fa-redo-alt fa-lg button"></i>
      <i class="fas fa-plus fa-lg button"></i>
      </div>
`;
    div.appendChild(cellDiv);

    canvases[i].push(cellDiv);
  }
}
