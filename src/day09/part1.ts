import * as fs from "fs";

const input = fs.readFileSync(`./src/day09/input.txt`, "utf-8");

const testInput = `2333133121414131402`;

// Parse input and execute
const splitInput = testInput.split("").map((el) => Number(el));

function moveBlocks(input: string[]) {
  let left = 0;
  let right = input.length - 1;
  while (left < right) {
    while (input[right][0] === "." || input[right][0] === "") {
      right--;
    }
    if (right < 0) break;

    const toMove = input[right];

    // can move
    if (input[left][0] === ".") {
      [input[left], input[right]] = [input[right], "."];
    }

    left++;
  }
  return input.filter((el) => el !== "");
}

function expandFiles(input: number[]) {
  let expandedInput = [];
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    if (i % 2 === 0) {
      const value = Array(input[i]).fill(id.toString());
      if (String(...value) === "") {
        continue;
      }

      expandedInput.push(...value);
      id += 1;
    } else {
      const memory = Array(input[i]).fill(".");
      expandedInput.push(...memory);
    }
  }
  return expandedInput;
}

function sumValues(input: string[]) {
  let result = 0;
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i][0] === ".") {
      continue;
    }
    result += parseInt(input[i]) * id;
    id++;
  }
  return result;
}

const mappedFiles = expandFiles(splitInput);
console.log("mappedFiles:", mappedFiles);
const compactFiles = moveBlocks(mappedFiles);
console.log("compactFiles:", compactFiles);

const result = sumValues(compactFiles);

console.log("Result:", result);
