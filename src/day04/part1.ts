import * as fs from "fs";

const day = process.env.DAY;
const input = fs.readFileSync(`./src/day04/input.txt`, "utf-8");
// const input = `MMMSXXMASM
// MSAMXMSMSA
// AMXSXMAAMM
// MSAMASMSMX
// XMASAMXAMM
// XXAMMXXAMA
// SMSMSASXSS
// SAXAMASAAA
// MAMMMXMMMM
// MXMXAXMASX`;

const matrix = input.split("\n").map((row) => row.split(""));

const directions = [
  [0, 1], // right
  [0, -1], // left
  [1, 0], // down
  [-1, 0], // up
  [1, 1], // down-right
  [1, -1], // down-left
  [-1, 1], // up-right
  [-1, -1], // up-left
];

function isValidWord(
  matrix: string[][],
  row: number,
  col: number,
  direction: number[],
  word: string
): boolean {
  const rowsNum = matrix.length;
  const colsNum = matrix[row].length;

  let newRow = row;
  let newCol = col;

  for (let i = 1; i < word.length; i++) {
    newRow += direction[0];
    newCol += direction[1];

    if (
      newRow < 0 ||
      newRow > rowsNum - 1 ||
      newCol < 0 ||
      newCol > colsNum - 1 ||
      matrix[newRow][newCol] !== word[i]
    ) {
      return false;
    }
  }
  return true;
}

function countWordOccurances(matrix: string[][], word: string): number {
  let count = 0;
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let row = 0; row < rows; row++) {
    const currentRow = matrix[row];
    for (let col = 0; col < cols; col++) {
      const letter = currentRow[col];

      if (letter === word[0]) {
        for (const direction of directions) {
          if (isValidWord(matrix, row, col, direction, word)) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

const result = countWordOccurances(matrix, "XMAS");

console.log("result: ", result);
