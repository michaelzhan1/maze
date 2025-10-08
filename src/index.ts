const MIN_SIZE = 5;
const MAX_SIZE = 50;

const form = document.getElementById("maze-form") as HTMLFormElement;
const maze = document.getElementById("maze") as HTMLDivElement;
const mazeContainer = document.getElementById(
  "maze-container"
) as HTMLDivElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const sizeStr = formData.get("size");
  if (isNaN(Number(sizeStr))) {
    alert(`Size must be a number between ${MIN_SIZE} and ${MAX_SIZE}`);
    return;
  }

  const size = Number(sizeStr);
  if (size < MIN_SIZE || size > MAX_SIZE) {
    alert(`Size must be a number between ${MIN_SIZE} and ${MAX_SIZE}`);
    return;
  }

  generateMaze(size);
});

function generateMaze(input: number): void {
  mazeContainer.innerHTML = "";
  const start = document.createElement("div");
  start.classList.add("flex-start");
  start.textContent = "Start";
  const end = document.createElement("div");
  end.classList.add("flex-end");
  end.textContent = "End";

  mazeContainer.appendChild(start);
  mazeContainer.appendChild(maze);
  mazeContainer.appendChild(end);

  maze.innerHTML = "";

  try {
    const mazeArr = buildMazeArray(input);

    const size = input * 2 + 1;
    for (let i = 0; i < size; i++) {
      const row = document.createElement("div");
      row.classList.add("row");

      for (let j = 0; j < size; j++) {
        const cell = document.createElement("div");
        cell.classList.add("col");
        cell.setAttribute("i", i.toString());
        cell.setAttribute("j", j.toString());
        if (mazeArr[i][j]) {
          cell.classList.add("white");
        }
        row.appendChild(cell);
      }

      maze.appendChild(row);
    }
  } catch (error) {
    console.error(error);
    alert("Error while building maze");
    return;
  }
}

function shuffleArrayCopy<T>(arr: T[]): T[] {
  const shuf = arr.slice();
  for (let i = shuf.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuf[i], shuf[j]] = [shuf[j], shuf[i]];
  }

  return shuf;
}

const directions = [
  [0, 2],
  [0, -2],
  [2, 0],
  [-2, 0],
];

function buildMazeArray(input: number): boolean[][] {
  const size = input * 2 + 1;

  const arr: boolean[][] = [];
  for (let i = 0; i < size; i++) {
    const arrRow: boolean[] = [];
    for (let j = 0; j < size; j++) {
      arrRow.push(false);
    }
    arr.push(arrRow);
  }

  const start = [1, 1];
  arr[1][0] = true;
  arr[1][1] = true;
  arr[size - 2][size - 1] = true;

  const stack = [];
  stack.push(start);
  while (stack.length > 0) {
    console.log(JSON.stringify(stack))
    const [i, j] = stack.pop()!;
    console.log(i, j);
    const shuf = shuffleArrayCopy(directions);
    shuf.forEach((dir) => {
      const [di, dj] = dir;
      const ii = i + di;
      const jj = j + dj;

      if (ii < 0 || ii >= size || jj < 0 || jj >= size || arr[ii][jj]) {
        return;
      }

      stack.push([ii, jj]);
      arr[ii][jj] = true;
      arr[i + di / 2][j + dj / 2] = true;
    });
  }

  return arr;
}
