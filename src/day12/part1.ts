import * as fs from "fs";

// Read input and solve
const input = fs.readFileSync("./src/day12/input.txt", "utf-8");
const testInput = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

const matrix = testInput.split("\n").map((row) => row.split(""));

// console.log("matrix: ", matrix);

function findRegions(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]; // Down, Up, Right, Left

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  function bfs(startRow: number, startCol: number, type: string) {
    const queue = [[startRow, startCol]];
    const region = [];

    let area = 0;
    let perimeter = 0;

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      if (visited[row][col]) continue;

      visited[row][col] = true;
      region.push({ row, col, type });
      area++;

      let exposedSides = 4;
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          grid[newRow][newCol] === type
        ) {
          queue.push([newRow, newCol]);
          exposedSides--;
        }
      }
      perimeter += exposedSides;
    }
    return { region, area, perimeter };
  }

  const regions = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!visited[row][col]) {
        regions.push(bfs(row, col, grid[row][col]));
      }
    }
  }
  let result = 0;
  regions.forEach((region) => {
    result += region.area * region.perimeter;
    // console.log(region);
  });
  console.log("result: ", result);
}

findRegions(matrix);
