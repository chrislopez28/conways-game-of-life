let svgns = "http://www.w3.org/2000/svg";
let viewBoxWidth = 100;
let viewBoxHeight = 100;
let rows = 100;
let cols = 100;
let strokeWidth = 2.5 / rows;
let spacing = 5;
let rounding = 0.25;
var gameOn = false;

gridX = viewBoxWidth/cols;
gridY = viewBoxHeight/rows;

for (let i = 0; i < cols; i++) {
	for (let j = 0; j < rows; j++) {
  	let rect = document.createElementNS(svgns, 'rect');
    rect.setAttributeNS(null, 'x', i * gridX + spacing * strokeWidth);
    rect.setAttributeNS(null, 'y', j * gridY + spacing * strokeWidth);
    rect.setAttributeNS(null, 'height', gridY - spacing * strokeWidth);
    rect.setAttributeNS(null, 'width', gridX - spacing * strokeWidth);
    rect.setAttributeNS(null, 'fill', 'none');
    rect.setAttributeNS(null, 'stroke', 'black');
    rect.setAttributeNS(null, 'stroke-width', strokeWidth);
    rect.setAttributeNS(null, 'rx', rounding);
    rect.setAttributeNS(null, 'pointer-events', 'all');
    rect.setAttributeNS(null, 'class', 'rect');
		rect.setAttributeNS(null, 'id', `${j}_${i}`);
    document.getElementById('grid').appendChild(rect);
  }
}

svg = document.getElementById('grid');

clicked = (event) => {
	let m = oMousePosSVG(event);
  console.log(m.y, m.x);
  updateSelectStatus(Math.floor(m.y / gridY), Math.floor(m.x / gridX));
}

svg.addEventListener("click", clicked);

var grid = [];

for (let i = 0; i < rows; i++) {
	grid.push([])
	for (let j = 0; j < cols; j++) {
  	grid[i].push({
    	color: "",
      selected: false,
      value: "",
      neighbors: 0,
      id: `${i}${j}`
    });
    if (grid[i][j].selected) {
      document.getElementById(`${i}_${j}`).classList.add("selected");
    } else {
      document.getElementById(`${i}_${j}`).classList.remove("selected");
  }
  }
}

randomizeCells = () => {
	for (let i = 0; i < rows; i++) {
  	for (let j = 0 ; j < cols; j++) {
    	grid[i][j].selected = ( Math.round(Math.random()) == 0 ? false : true );
    }
  }
}

updateLifeStatus = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!grid[i][j].selected) {
        if (grid[i][j].neighbors == 3) {
          grid[i][j].selected = true;
        }
      }
      if (grid[i][j].selected) {
        if (grid[i][j].neighbors < 2 || grid[i][j].neighbors > 3) {
          grid[i][j].selected = false;
        }
      }
    }
  }
}

updateCells = () => {
	for (let i = 0; i < rows; i++) {
  	for (let j = 0; j < cols; j++) {
      if (grid[i][j].selected) {
        document.getElementById(`${i}_${j}`).classList.add("selected");
      } else {
        document.getElementById(`${i}_${j}`).classList.remove("selected");
    	}
    }
  }
}

clearCells = () => {
	for (let i = 0; i < rows; i++) {
  	for (let j = 0; j < cols; j++) {
    	grid[i][j].selected = false;
    }
  }
}

countNeighbors = (i, j) => {
	count = 0;
  if ( (i - 1 >= 0) && (j - 1 >= 0) ) {
  	count += grid[i-1][j-1].selected;
  }
  if ( (i - 1 >= 0) && (j + 1 < cols) ) {
  	count += grid[i-1][j+1].selected;
  }
  if ( (i + 1 < rows) && (j - 1 >= 0) ) {
  	count += grid[i+1][j-1].selected;
  }
  if ( (i + 1 < rows) && (j + 1 < cols) ) {
  	count += grid[i+1][j+1].selected;
  }
  if (i - 1 >= 0) {
  	count += grid[i-1][j].selected;
  }
  if (i + 1 < rows) {
  	count += grid[i+1][j].selected;
  }
  if (j - 1 >= 0) {
  	count += grid[i][j-1].selected;
  }
  if (j + 1 < cols) {
  	count += grid[i][j+1].selected;
  }
  return count;
}

updateNeighbors = () => {
	for (let i = 0; i < rows; i++) {
  	for (let j = 0; j < cols; j++) {
    	grid[i][j].neighbors = countNeighbors(i, j);
    }
  }
}

const updateSelectStatus = (i, j) => {
  console.log(i, j);
  grid[i][j].selected = !grid[i][j].selected; 
  if (grid[i][j].selected) {
  	document.getElementById(`${i}_${j}`).classList.add("selected");
  } else {
  	document.getElementById(`${i}_${j}`).classList.remove("selected");
  }
}

oMousePosSVG = (e) => {
	let p = svg.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  let ctm = svg.getScreenCTM().inverse();
  p = p.matrixTransform(ctm);
  return p;
}

var gameInterval;

runGame = () => {
	gameOn = !gameOn;
	if (gameOn) {
  	gameInterval = 	setInterval( () => {
      updateNeighbors();
      updateLifeStatus();
      updateCells();
    	}, 100);
    document.getElementById("runButton").innerHTML = "Stop"
  } else {
  	clearInterval(gameInterval);
    document.getElementById("runButton").innerHTML = "Run"
  }
}



