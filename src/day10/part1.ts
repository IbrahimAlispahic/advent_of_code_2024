import * as fs from "fs";

const input = fs.readFileSync(`./src/day10/input.txt`, "utf-8");

const testInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

// Parse input and execute
const matrix = testInput
  .split("\n")
  .map((row) => row.split("").map((el) => Number(el)));

console.log("matrix: ", matrix);


function bfs(matrix: string | any[], startRow: number, startCol: number) {
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]; // Down, Up, Right, Left
  const queue = [[startRow, startCol]];
  const visited = new Set();
  visited.add(`${startRow},${startCol}`);
  let score = 0;

  while (queue.length > 0) {
    const [row, col] = queue.shift()!;

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      // Check bounds and ensure valid height increment
      if (
        newRow >= 0 &&
        newRow < matrix.length &&
        newCol >= 0 &&
        newCol < matrix[0].length &&
        matrix[newRow][newCol] === matrix[row][col] + 1 &&
        // remove this check for pt2
        !visited.has(`${newRow},${newCol}`)
      ) {
        queue.push([newRow, newCol]);
        visited.add(`${newRow},${newCol}`);
        if (matrix[newRow][newCol] === 9) score++;
      }
    }
  }

  return score;
}

let score = 0
for (let row = 0; row < matrix.length; row++) {
  for (let col = 0; col < matrix[0].length; col++) {
    if (matrix[row][col] === 0) {
      score += bfs(matrix, row, col);
    }
  }
}

console.log('score: ', score);

