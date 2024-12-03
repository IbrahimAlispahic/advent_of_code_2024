import * as fs from "fs";

const day = process.env.DAY;
const input = fs.readFileSync(`./src/day${day}/input.txt`, "utf-8");

// const input = `3   4
// 4   3
// 2   5
// 1   3
// 3   9
// 3   3`;

let inputRows = input.split("\n");
const array1: number[] = [];    
const array2: number[] = [];

for (const row of inputRows) {
  const [el1, el2] = row.split("   ");
  array1.push(Number(el1));
  array2.push(Number(el2));
}

array1.sort();
array2.sort();

let distance = 0;
for (let i = 0; i < array1.length; i++) {
  const difference = Math.abs(array1[i] - array2[i]);
  distance += difference;
}

console.log("distance: ", distance);

const freqencyMap = new Map<number, number>();
for (const el of array2) {
  freqencyMap.set(el, (freqencyMap.get(el) || 0) + 1);
}

let score = 0;
for (const el1 of array1) {
  //   const matchedEls = array2.filter((el2) => el2 === el1);
  // better with frequency map
  const matchedEls = freqencyMap.get(el1) || 0;
  score += el1 * matchedEls;
}

console.log("score: ", score);