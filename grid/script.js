// Read the URL params
let query = getQueryParams(document.location.search);

// Set the title of the page
document.title = `${query.equations} Attractors`

// Create the instructions to build the canvases grid
let canvasBuilder = getCanvasBuilder(query);

// Specify the size of the canvas
let canvasSize = query.size;

// Create an empty array that will contain (canvasBuilder.cols x
// canvasBuilder.rows) canvases
let canvases = [];

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

for (let i = 0; i < canvasBuilder.rows; i++) {
  canvases.push([]);
  let div = document.createElement("div");
  div.className = "canvas-row";
  document.body.appendChild(div);

  for (let j = 0; j < canvasBuilder.cols; j++) {
    let cellDiv = createCellDivElement(i, j);
    div.appendChild(cellDiv);
    canvases[i].push(cellDiv);
  }
}

function generateRandomValues() {
  return {
    a: Math.random() * 4 - 2,
    b: Math.random() * 4 - 2,
    c: Math.random() * 4 - 2,
    d: Math.random() * 4 - 2
  };
}

function createCellDivElement(i, j) {
  // Create the HTML element
  let cellDiv = document.createElement("div");

  // Initialize the container
  cellDiv.id = `canvas-container-${i}-${j}`;
  cellDiv.style.maxWidth = canvasSize;
  cellDiv.style.maxHeight = canvasSize;
  cellDiv.className = "canvas-container";

  //  isLocked is used to know if redrawing is required in this cell
  cellDiv.setAttribute("isLocked", false);

  // Div that contains the parameters to control the cell
  let cellController = document.createElement("div");
  cellController.className = "cell-controller";

  // Div where the parameters are rendered
  let cellControllerText = document.createElement("div");
  cellControllerText.className = "text";

  cellController.appendChild(cellControllerText);
  cellDiv.appendChild(cellController);

  // Generate random values for the attractor
  let { a, b, c, d } = generateRandomValues();

  // Assign them in the html element so it can be retreived by p5.js in sketch.js
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
    <span id="locked-icon-container">
      <i id="locked-icon" class="fas fa-unlock fa-lg button" onClick="blockCanvas('canvas-container-${i}-${j}')"></i>
    </span>
    <i id="copy-icon" class="far fa-copy fa-lg button" onClick="copyValues('canvas-container-${i}-${j}')"></i>
    <a id ="draw-attractor-external" href="../drawer/?equations=${query.equations.toLowerCase()}&a=${a}&b=${b}&c=${c}&d=${d}" target="_blank"><i class="fas fa-external-link-alt fa-lg button"></i></a>
    </div>
`;
  createLockerButton(cellControllerText);

  return cellDiv;
}

function createAttractorVariableController(title, value) {
  let attractorVariableController = document.createElement("div");
  attractorVariableController.className = "attractor-variable-controller";

  let attractorVariable = document.createElement("div");
  attractorVariable.className = "attractor-variable";
  attractorVariable.innerHTML = `${title} =`;

  let valueController = document.createElement("div");
  valueController.className = "value-controller";

  valueController.innerHTML = `
    <div class="current-value" id="c-value" value = ${value}>
          ${c < 0 ? value.toFixed(7) : value.toFixed(8)}
        </div>
        <div class="decrease-value">
          <i class="fas fa-arrow-down button"></i>
        </div>
        <div class="increase-value">
          <i class="fas fa-arrow-up button"></i>
        </div>`;

  attractorVariableController.appendChild(attractorVariable);
  attractorVariableController.appendChild(valueController);
  return attractorVariableController;
}

function createLockerButton(cellControllerText) {
  let lockedContainer = cellControllerText.querySelector(
    "#locked-icon-container"
  );

  lockedContainer.addEventListener("click", () => {
    let iconItem = lockedContainer.childNodes[1];
    if (iconItem.classList.contains("fa-unlock")) {
      iconItem.classList.remove("fa-unlock");
      iconItem.classList.add("fa-lock");
      iconItem.style.color = "#c54444";
    } else {
      iconItem.classList.remove("fa-lock");
      iconItem.classList.add("fa-unlock");
      iconItem.style.color = "white";
    }
  });
}

function updateAttractorValuesAttribute(canvas, values) {
  canvas.setAttribute(
    "attractor-values",
    `
    ${values[0]},
    ${values[1]},
    ${values[2]},
    ${values[3]}
  `
  );
}

function formatNumberForDisplay(n) {
  return n < 0 ? n.toFixed(7) : n.toFixed(8);
}

function updateAttractorValuesFields(canvas, values) {
  let variables = ["a", "b", "c", "d"];
  for (let i = 0; i < variables.length; i++) {
    canvas.querySelector(
      `#${variables[i]}-value`
    ).innerHTML = formatNumberForDisplay(values[i]);
  }
}

function updateDrawLink(canvas, values) {
  let linkElement = canvas.querySelector("#draw-attractor-external");
  linkElement.setAttribute(
    "href",
    `../drawer/?equations=${query.equations.toLowerCase()}&a=${values[0]}&b=${
      values[1]
    }&c=${values[2]}&d=${values[3]}`
  );
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

        updateAttractorValuesAttribute(canvases[i][j], values);
        updateAttractorValuesFields(canvases[i][j], values);
        updateDrawLink(canvases[i][j], values);

        unlockedCanvases.push(canvases[i][j]);
      }
    }
    drawCanvases();
  }
});

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

/**
 * Fetch the information to build the grid of canvas elements
 *
 * @param {Object} info   URL Params
 * @return {Object}       Contains the number of cols, rows, and margins
 *                        between them.
 */
function getCanvasBuilder(info) {
  // Default at 300 if not size provided
  let canvasSize = info.size ? info.size : 300;

  // Calculate the number of rows and cols using width and height of window
  let canvasBuilder = {
    cols: Math.floor(window.innerWidth / canvasSize),
    rows: Math.floor(window.innerHeight / canvasSize)
  };

  // Calculate the space between columns and rows
  canvasBuilder.colsMargin = Math.round(
    (window.innerWidth % canvasSize) / (canvasBuilder.cols + 1)
  );
  canvasBuilder.rowsMargin = Math.round(
    (window.innerHeight % canvasSize) / (canvasBuilder.rows + 1)
  );

  return canvasBuilder;
}

/**
 * Copy the values of the cell clicked to the clipboard
 * @param {number} a    `a` value
 * @param {number} b    `b` value
 * @param {number} c    `c` value
 * @param {number} d    `d` value
 */
function copyValues(canvas) {
  canvas = document.getElementById(canvas);
  let values = canvas.getAttribute("attractor-values");
  values = values.split(",").map(e => Number(e));
  let str = `a = ${values[0]}, b = ${values[1]}, c = ${values[2]}, d = ${
    values[3]
  }`;
  console.log(
    `a = ${values[0]}, b = ${values[1]}, c = ${values[2]}, d = ${values[3]}`
  );
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

/**
 * Inrepolates between true and false for the isLocked attribute of
 * a canvas cell
 *
 * @param {string} id   ID of the canvas cell to be locked/unlocked
 */
function blockCanvas(id) {
  let canvasElement = document.getElementById(id);
  if (canvasElement.getAttribute("isLocked") === "true") {
    canvasElement.setAttribute("isLocked", false);
  } else {
    document.getElementById(id).setAttribute("isLocked", true);
  }
}
