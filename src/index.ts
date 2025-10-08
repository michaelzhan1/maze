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

  generateMaze(size * 2 + 1);
});

function generateMaze(size: number): void {
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

  for (let i = 0; i < size; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < size; j++) {
      const col = document.createElement("div");
      col.classList.add("col");
      col.setAttribute("i", i.toString());
      col.setAttribute("j", j.toString());
      row.appendChild(col);
    }

    maze.appendChild(row);
  }
}
