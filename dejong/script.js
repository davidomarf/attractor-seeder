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
    cellDiv.setAttribute("isLocked", false);

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

    cellDiv.setAttribute("attractor-values", `${a}, ${b}, ${c}, ${d}`);

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
          <div class="current-value" id="b-value" value = ${b}>
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
          <div class="current-value" id="c-value" value = ${c}>
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
          <div class="current-value" id="d-value" value = ${d}>
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
      <i id="locked-icon" class="fas fa-unlock fa-lg button" onClick="blockCanvas('canvas-container-${i}-${j}')"></i>
      <i id="copy-icon" class="far fa-copy fa-lg button" onClick="copyValues(${[
        a,
        b,
        c,
        d
      ]})"></i>
      <i class="fas fa-redo-alt fa-lg button"></i>
      <i class="fas fa-plus fa-lg button"></i>
      </div>
`;
    div.appendChild(cellDiv);

    canvases[i].push(cellDiv);
  }
}

function copyValues(a, b, c, d) {
  let str = `a = ${a}, b = ${b}, c = ${c}, d = ${d}`;

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

document.addEventListener("keypress", function onEvent(event) {
  if (event.key === " ") {
    let unlockedCanvases = [];
    for (let i = 0; i < canvases.length; i++) {
      for (let j = 0; j < canvases[i].length; j++) {
        if (canvases[i][j].getAttribute("isLocked") === "true") continue;
        let values = [
          Math.random() * 4 - 2,
          Math.random() * 4 - 2,
          Math.random() * 4 - 2,
          Math.random() * 4 - 2
        ];
        canvases[i][j].setAttribute(
          "attractor-values",
          `
          ${values[0]},
          ${values[1]},
          ${values[2]},
          ${values[3]}
        `
        );
        console.log(canvases[i][j])
        canvases[i][j].querySelector("#copy-icon").setAttribute("onClick",
        `copyValues(${[
          values[0],
          values[1],
          values[2],
          values[3]
        ]})`);
        console.log(canvases[i][j])
        unlockedCanvases.push(canvases[i][j]);
      }
    }
    drawCanvases();
  }
});

function blockCanvas(id) {
  let canvasElement = document.getElementById(id);
  if (canvasElement.getAttribute("isLocked") === "true") {
    canvasElement.setAttribute("isLocked", false);
  } else {
    document.getElementById(id).setAttribute("isLocked", true);
  }
}
