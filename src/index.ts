import { MAX_SIZE, MIN_SIZE } from "./constants.js";
import { getIdx, getNeighbors, shuffleArrayCopy } from "./util.js";

// get dom elements
const form = document.getElementById("maze-form") as HTMLFormElement;
const maze = document.getElementById("maze") as HTMLDivElement;
const mazeContainer = document.getElementById(
  "maze-container"
) as HTMLDivElement;

const cellMap = new Map<number, HTMLDivElement>();
const solvedPathCells = new Set<number>();
let remainingCells = 0;
let extraCells = 0;

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
  solve.forEach((idx) => solvedPathCells.add(idx));
  remainingCells = solve.length;
});

function generateMazeAndSolve(input: number): number[] {
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

  cellMap.clear();
  solvedPathCells.clear();
  remainingCells = 0;
  extraCells = 0;

  try {
    const { mazeArr, mazeSolve } = buildMazeArray(input);

    const size = input * 2 + 1;
    for (let i = 0; i < size; i++) {
      const row = document.createElement("div");
      row.classList.add("row");

      for (let j = 0; j < size; j++) {
        const idx = getIdx(i, j, size);

        const cell = document.createElement("div");
        cell.classList.add("col");
        cell.id = idx.toString();
        if (mazeArr[idx]) {
          cell.classList.add("white");
        }

        if (i % 2 == 1 && j % 2 == 1) {
          cell.addEventListener("click", () => {
            if (cell.classList.contains("green")) {
              // deselect
              cell.classList.remove("green");
              const id = Number(cell.id);
              const neighbors = getNeighbors(id, size);
              neighbors.forEach((nidx) => {
                if (cellMap.get(nidx)?.classList.contains("green")) {
                  cellMap
                    .get(id + Math.floor((nidx - id) / 2))
                    ?.classList.remove("green");
                }
              });

              if (solvedPathCells.has(id)) {
                remainingCells += 1;
              } else {
                extraCells -= 1;
              }
            } else {
              // select
              cell.classList.add("green");
              const id = Number(cell.id);
              const neighbors = getNeighbors(id, size);
              neighbors.forEach((nidx) => {
                if (cellMap.get(nidx)?.classList.contains("green")) {
                  cellMap
                    .get(id + Math.floor((nidx - id) / 2))
                    ?.classList.add("green");
                }
              });

              if (solvedPathCells.has(id)) {
                remainingCells -= 1;
              } else {
                extraCells += 1;
              }

              if (remainingCells == 0 && extraCells == 0) {
                setTimeout(() => alert("You solved the maze!"), 0);
              }
            }

            console.log(remainingCells, extraCells);
          });
        }

        row.appendChild(cell);
        cellMap.set(idx, cell);
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

function buildMazeArray(input: number): {
  mazeArr: boolean[];
  mazeSolve: number[];
} {
  const size = input * 2 + 1;
  const prev = new Map<number, number>();

  const arr: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    arr.push(false);
  }

  const start = getIdx(1, 1, size);
  arr[getIdx(1, 0, size)] = true; // start hole
  arr[getIdx(1, 1, size)] = true; // start
  arr[getIdx(size - 2, size - 1, size)] = true; // end hole

  const stack = [];
  stack.push([start, -1]);
  while (stack.length > 0) {
    const [idx, pidx] = stack.pop()!;
    const next = shuffleArrayCopy(getNeighbors(idx, size));
    prev.set(idx, pidx);

    next.forEach((nidx) => {
      if (arr[nidx]) return;

      stack.push([nidx, idx]);
      arr[nidx] = true;
      arr[idx + Math.floor((nidx - idx) / 2)] = true;
    });
  }

  // walk backwards from end
  let idx = getIdx(size - 2, size - 2, size);
  const solve = [idx];
  while (prev.get(idx) !== -1) {
    const pidx = prev.get(idx);
    if (pidx === undefined) {
      throw new Error("Error while solving maze");
    }
    idx = pidx;
    solve.push(idx);
  }

  return {
    mazeArr: arr,
    mazeSolve: solve.reverse(),
  };
}
