import * as fs from "fs";

// Read input and solve
const input = fs.readFileSync("./src/day18/input.txt", "utf-8");
const testInput = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

const inputs = input.split("\n");

type Coordinate = [number, number];

const INPUT_BYTES = [];
const GRID_SIZE = 71;
const NUMBER_OF_BYTES = 1024;

function initializeGrid(size: number, corrupted: number[][]): string[][] {
  const grid = Array.from({ length: size }, () => Array(size).fill("."));
  for (const [x, y] of corrupted) {
    grid[y][x] = "#"; // Mark corrupted cells
  }
  return grid;
}

function printGrid(grid: string[][]): void {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function findShortestPath(
  grid: string[][],
  start: Coordinate,
  end: Coordinate
): number | null {
  const directions = [
    [0, 1], // Down
    [1, 0], // Right
    [0, -1], // Up
    [-1, 0], // Left
  ];
  const queue: [Coordinate, number][] = [[start, 0]]; // [Position, Steps]
  const visited = new Set<string>();

  visited.add(start.join(","));

  while (queue.length > 0) {
    const [[x, y], steps] = queue.shift()!;
    if (x === end[0] && y === end[1]) return steps;

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`;

      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < grid.length &&
        ny < grid[0].length &&
        grid[ny][nx] !== "#" &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([[nx, ny], steps + 1]);
      }
    }
  }
  return null; // No path found¸
}

for (const row of inputs) {
  INPUT_BYTES.push(row.split(",").map(Number));
}

for (let i = 0; i < INPUT_BYTES.length; i++) {
  const corruptedCoordinates = INPUT_BYTES.slice(0, i);
  const grid = initializeGrid(GRID_SIZE, corruptedCoordinates);
  //   printGrid(grid);
  const shortestPath = findShortestPath(
    grid,
    [0, 0],
    [GRID_SIZE - 1, GRID_SIZE - 1]
  );
  if (shortestPath === null) {
    console.log("Coordinates to break path:", INPUT_BYTES[i - 1]);
    break;
  }
}

// console.log("Shortest Path:", shortestPath);
