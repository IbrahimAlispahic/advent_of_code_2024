import * as fs from "fs";

const day = process.env.DAY;
const input = fs.readFileSync(`./src/day02/input.txt`, "utf-8");

// const input = `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9`;

let inputRows = input.split("\n");

function isSafeReport(report: number[]): boolean {
  const startDifference = report[1] - report[0];
  if (startDifference === 0) {
    return false;
  }
  if (report.length < 2) {
    return true;
  }
  for (let i = 1; i < report.length - 1; i++) {
    const difference = report[i + 1] - report[i];

    if (
      (startDifference <= 0 && difference > 0) ||
      (startDifference >= 0 && difference < 0) ||
      difference === 0 ||
      Math.abs(startDifference) > 3 ||
      Math.abs(difference) > 3
    ) {
      return false;
    }
  }
  return true;
}

function findSafe(report: number[]) {
  console.log("report: ", report);

  if (isSafeReport(report)) {
    return true;
  }

  // addition for pt 2
  for (let i = 0; i < report.length; i++) {
    const newReport = report.filter((_, index) => index !== i);
    if (isSafeReport(newReport)) {
      return true;
    }
  }

  return false;
}

let safeOnes = 0;

for (const row of inputRows) {
  const report = row.split(" ").map((val) => Number(val));
  if (findSafe(report)) {
    safeOnes++;
  }
}

console.log("safeOnes: ", safeOnes);
