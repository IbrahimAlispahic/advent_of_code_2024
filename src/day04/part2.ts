import * as fs from "fs";

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

function isValidArm(
  matrix: string[][],
  row: number,
  col: number,
  direction: number[][]
): boolean {
  const rowsNum = matrix.length;
  const colsNum = matrix[0].length;
  let letters = ""; // Start with 'A' as the center

  for (let i = 0; i <= 1; i++) {
    let newRow = row;
    let newCol = col;

    newRow += direction[i][0];
    newCol += direction[i][1];

    if (newRow < 0 || newRow >= rowsNum || newCol < 0 || newCol >= colsNum) {
      return false;
    }

    letters += matrix[newRow][newCol];
  }

  return letters === "MS" || letters === "SM";
}

function countXMASPatterns(matrix: string[][]): number {
  const rows = matrix.length;
  let count = 0;

  const directionPairs = [
    [
      [1, 1],
      [-1, -1],
    ], // down-right and up-left
    [
      [1, -1],
      [-1, 1],
    ], // down-left and up-right
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === "A") {
        const arm1Valid = isValidArm(matrix, row, col, directionPairs[0]);
        const arm2Valid = isValidArm(matrix, row, col, directionPairs[1]);
        if (arm1Valid && arm2Valid) {
          count++;
        }
      }
    }
  }

  return count;
}

const result = countXMASPatterns(matrix);
console.log("Occurrences of X-MAS:", result);
