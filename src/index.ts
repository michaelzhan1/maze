const MIN_SIZE = 5;
const MAX_SIZE = 50;

const form = document.getElementById("maze-form") as HTMLFormElement;
const maze = document.getElementById("maze") as HTMLDivElement;
const mazeContainer = document.getElementById(
  "maze-container"
) as HTMLDivElement;

// const remaining

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

  const solve = generateMazeAndSolve(size);
});

function generateMazeAndSolve(input: number): [number, number][] {
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
    const { mazeArr, mazeSolve } = buildMazeArray(input);

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
    return mazeSolve;
  } catch (error) {
    console.error(error);
    alert("Error while building maze");
    return [];
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

function buildMazeArray(input: number): {
  mazeArr: boolean[][];
  mazeSolve: [number, number][];
} {
  const size = input * 2 + 1;
  const prev = new Map<number, number>();

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
  stack.push([...start, -1, -1]);
  while (stack.length > 0) {
    const [i, j, pi, pj] = stack.pop()!;

    const idx = i * size + j;
    const pidx = pi * size + pj;
    prev.set(idx, pidx);

    const shuf = shuffleArrayCopy(directions);
    shuf.forEach((dir) => {
      const [di, dj] = dir;
      const ii = i + di;
      const jj = j + dj;

      if (ii < 0 || ii >= size || jj < 0 || jj >= size || arr[ii][jj]) {
        return;
      }

      stack.push([ii, jj, i, j]);
      arr[ii][jj] = true;
      arr[i + di / 2][j + dj / 2] = true;
    });
  }

  // walk backwards from end
  let i = size - 2;
  let j = size - 2;
  const solve = [[i, j]];
  while (prev.get(i * size + j) !== -1 * size - 1) {
    const pidx = prev.get(i * size + j);
    if (pidx === undefined) {
      throw new Error("Error while solving maze");
    }
    i = Math.floor(pidx / size);
    j = pidx % size;
    solve.push([i, j]);
  }

  return {
    mazeArr: arr,
    mazeSolve: solve.reverse() as [number, number][],
  };
}
