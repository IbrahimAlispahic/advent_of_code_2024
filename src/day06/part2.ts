import * as fs from "fs";

const day = process.env.DAY;
const input = fs.readFileSync(`./src/day06/input.txt`, "utf-8");
const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const matrix = input.split("\n").map((row) => row.split(""));

function findStart(matrix: string[][]): [number, number] {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col] === "^") {
        return [row, col];
      }
    }
  }
}

function getNextPosition(
  row: number,
  col: number,
  directionIndex: number
): number[] {
  const [rowDirection, colDirection] = DIRECTIONS[directionIndex];
  return [row + rowDirection, col + colDirection];
}

const DIRECTIONS = [
  [-1, 0], // UP
  [0, 1], // RIGHT
  [1, 0], // DOWN
  [0, -1], // LEFT
];

function rotateRight(currentIndex: number): number {
  return (currentIndex + 1) % DIRECTIONS.length; // Wrap around
}

function checkIfLoop(matrix: string[][], startPos: number[]): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  let [row, col] = startPos;

  // set inital direction
  let directionIndex = 0;
  const visited = new Set<string>();

  while (true) {
    const spotToAdd = `${row},${col},${directionIndex}`;
    // loop detected
    if (visited.has(spotToAdd)) {
      return true;
    }

    visited.add(spotToAdd);

    // get coordinates on next position
    const [nextRow, nextCol] = getNextPosition(row, col, directionIndex);

    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) {
      break;
    }

    if (matrix[nextRow][nextCol] !== "#") {
      row = nextRow;
      col = nextCol;
    } else {
      directionIndex = rotateRight(directionIndex);
    }
  }
}

function countLoops(matrix: string[][]): number {
  let loopCounter = 0;
  const startPos = findStart(matrix);
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (matrix[row][col] !== "#") {
        const originalValue = matrix[row][col];
        matrix[row][col] = "#";
        if (checkIfLoop(matrix, startPos)) {
          loopCounter++;
        }
        matrix[row][col] = originalValue;
      }
    }
  }
  return loopCounter;
}

console.time("Execution Time"); // Start the timer
console.log(countLoops(matrix)); // Your function call
console.timeEnd("Execution Time"); // End the timer and print the elapsed time
