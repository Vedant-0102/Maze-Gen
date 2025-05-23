let cols, rows;
let w = 20;
let grid = [];
let current;
let stack = [];
let isGenerating = false;

function setup() {
  const canvas = createCanvas(500, 500);
  canvas.parent('mazeCanvas');

  cols = floor(width / w);
  rows = floor(height / w);

  grid = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      grid.push(new Cell(i, j));
    }
  }

  current = grid[0];
  frameRate(30);
}

function draw() {
  background('#16213e');

  for (let cell of grid) {
    cell.show();
  }

  if (isGenerating) {
    current.visited = true;
    current.highlight();

    let next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      isGenerating = false;
      updateStatus('Generation complete!', 'complete');
    }
  }
}

function startGeneration() {
  if (!isGenerating) {
    isGenerating = true;
    updateStatus('Generating maze...', 'generating');
  }
}

function resetMaze() {
  isGenerating = false;
  stack = [];
  setup();
  updateStatus('Ready to generate', '');
}

function updateStatus(text, state) {
  document.getElementById('status-text').textContent = text;
  const dot = document.getElementById('status-dot');
  dot.className = 'status-dot ' + state;
}

function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
  return i + j * cols;
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  let y = a.j - b.j;

  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  checkNeighbors() {
    let neighbors = [];
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return random(neighbors);
    }
    return undefined;
  }

  show() {
    let x = this.i * w;
    let y = this.j * w;
    stroke('#374151');
    if (this.walls[0]) line(x, y, x + w, y);
    if (this.walls[1]) line(x + w, y, x + w, y + w);
    if (this.walls[2]) line(x + w, y + w, x, y + w);
    if (this.walls[3]) line(x, y + w, x, y);

    if (this.visited) {
      noStroke();
      fill('rgba(99, 102, 241, 0.15)');
      rect(x, y, w, w);
    }
  }

  highlight() {
    let x = this.i * w;
    let y = this.j * w;
    noStroke();
    fill('#06d6a0');
    rect(x, y, w, w);
  }
}
