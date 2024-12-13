import * as fs from "fs";

const day = process.env.DAY;
const input = fs.readFileSync(`./src/day07/input.txt`, "utf-8");
const testInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

function generateCombinations(n: number) {
  const combinations = [];
  const numCombinations = 3 ** (n - 1); // 3^(n-1)
  for (let i = 0; i < numCombinations; i++) {
    const ternary = i.toString(3).padStart(n - 1, "0"); // Convert to ternary
    const operators = ternary.split("").map((digit) => {
      if (digit === "0") return "+";
      if (digit === "1") return "*";
      if (digit === "2") return "||";
    });
    combinations.push(operators);
  }
  return combinations;
}

function canOperatorProduceValue(
  testValue: number,
  operators: number[]
): boolean {
  const combinations = generateCombinations(operators.length);
  for (const combination of combinations) {
    let result = operators[0];

    for (let i = 0; i < combination.length; i++) {
      const operation = combination[i];

      if (operation === "+") {
        result += operators[i + 1];
      } else if (operation === "*") {
        result *= operators[i + 1];
      } else if (operation === "||") {
        result = Number(result.toString() + operators[i + 1].toString());
      }
      if (result > testValue) {
        break;
      }
    }

    if (result === testValue) {
      return true;
    }
  }
  return false;
}

console.time("Execution Time"); // Start the timer

const rows = input.split("\n");
let result = 0;
for (const row of rows) {
  const [testValue, operatorsStr] = row.split(": ");
  const operators = operatorsStr.split(" ").map((operator) => Number(operator));
  if (canOperatorProduceValue(Number(testValue), operators)) {
    result += Number(testValue);
  }
}

console.log("result: ", result);
console.timeEnd("Execution Time"); // End the timer and print the elapsed time
