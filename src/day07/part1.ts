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
  const numCombinations = 2 ** (n - 1); // 2^(n-1)
  for (let i = 0; i < numCombinations; i++) {
    const binary = i.toString(2).padStart(n - 1, "0"); // Convert to binary
    const operators = binary.split("").map((bit) => (bit === "0" ? "+" : "*"));
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
      }
      if (result > testValue) {
        break;
      }
    }

    if (result === testValue) {
      // console.log("testValue: ", testValue);
      // console.log("operators: ", operators);

      return true;
    }
  }
  return false;
}

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
