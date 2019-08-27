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

    div.appendChild(cellDiv);

    canvases[i].push(cellDiv);
  }
}
