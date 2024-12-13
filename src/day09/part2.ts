import * as fs from "fs";

const input = fs.readFileSync(`./src/day09/input.txt`, "utf-8");

const testInput = `2333133121414131402`;

// Parse input and execute
const splitInput = input.split("").map((el) => Number(el));

function moveBlocks(input: string[]) {
  let right = input.length - 1;
  let tempRight = right;
  console.log("input: ", input);
  while (right > 0) {
    while (input[right][0] === ".") {
      right--;
    }
    for (let left = 0; left < right; left++) {
      while (input[left][0] !== "." && left < right) {
        left++;
      }
      const toMove = input[right];
      tempRight = right;

      let numberOfSameEls = 0;
      while (input[tempRight] !== "." && input[tempRight] === toMove) {
        // console.log("minus temp...", input[tempRight], toMove);
        numberOfSameEls++;
        tempRight--;
      }
      // console.log("numberOfSameEls; ", numberOfSameEls);

      // can move
      const hasSpace = input
        .slice(left, left + numberOfSameEls)
        .every((el) => el === ".");
      if (numberOfSameEls > 0 && hasSpace) {
        // console.log("has space!");

        for (let i = 0; i < numberOfSameEls; i++) {
          [input[left + i], input[tempRight + 1 + i]] = [
            input[tempRight + 1 + i],
            input[left + i],
          ];
        }

        // console.log("input: ", input);
        right = tempRight;
        break;
      }
    }
    right = tempRight;
  }

  return input.filter((el) => el !== "");
}

function expandFiles(input: number[]) {
  let expandedInput = [];
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    if (i % 2 === 0) {
      const value = Array(input[i]).fill(id.toString());
      // const value = id.toString().repeat(input[i]);
      if (String(...value) === "") {
        continue;
      }
      // console.log("value: ", value);

      expandedInput.push(...value);
      id += 1;
    } else {
      // const memory = ".".repeat(input[i]);
      const memory = Array(input[i]).fill(".");
      // console.log("memory: ", memory);
      expandedInput.push(...memory);
    }
  }
  return expandedInput;
}

function sumValues(input: string[]) {
  let result = 0;
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === ".") {
      continue;
    }
    // console.log("parseInt(input[i]): ", parseInt(input[i]));

    result += parseInt(input[i]) * i;
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
