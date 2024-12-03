import * as fs from "fs";

const day = process.env.DAY;
const input = fs.readFileSync(`./src/day03/input.txt`, "utf-8");
// const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const regex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;

let result = 0;
let enabled = true;
const matches = input.match(regex);

matches.forEach((match) => {
  // part 2 addition
  if (match === "do()") {
    enabled = true;
  } else if (match === `don't()`) {
    enabled = false;
  }
  // part 2 additon
  if (match.startsWith("mul(") && enabled) {
    const [number1, number2] = match.match(/\d+/g).map(Number);
    result += number1 * number2;
  }
});

// console.log("matches: ", matches);
console.log("result: ", result);
