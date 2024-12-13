import * as fs from "fs";

// Read input and solve
const input = fs.readFileSync("./src/day13/input.txt", "utf-8");
const testInput = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

const inputs = input.split("\n\n").map((input) => input.split("\n"));

function extractMoves(buttonMove: string) {
  return buttonMove
    .split(": ")[1]
    .split(", ")
    .map((el) => Number(el.split("+")[1]));
}

function extractPrize(prizeLocation: string) {
  return prizeLocation
    .split(": ")[1]
    .split(", ")
    .map((el) => Number(el.split("=")[1]) + 10000000000000);
}

function solveEquations(input: string[]) {
  const [ax, ay] = extractMoves(input[0]);
  const [bx, by] = extractMoves(input[1]);

  const [px, py] = extractPrize(input[2]);

  // px == ax * a + bx * b
  // py == ay * a + by * b
  // a = (px - bx * b) / ax
  // py = ay * (px - bx * b) / ax + by * b
  // py * ax = ay * (px - bx * b) + by * ax * b
  // py * ax = ay * px - ay * bx * b + by * ax * b
  // py * ax = ay * px + (by * ax - ay * bx) * b
  // b = (py * ax - ay * px) / (by * ax - ay * bx)

  const b = (py * ax - ay * px) / (by * ax - ay * bx);
  const a = (px - bx * b) / ax;

  // console.log("b: ", b);
  // console.log("a: ", a);

  if (Math.round(a) !== a || Math.round(b) !== b) {
    return 0;
  }

  return a * 3 + b;
}

let tokens = 0;
for (const input of inputs) {
  tokens += solveEquations(input);
}

console.log("tokens: ", tokens);
