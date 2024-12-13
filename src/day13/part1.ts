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
    .map((el) => Number(el.split("=")[1]));
}

let tokens = 0;
for (const input of inputs) {
  const [ax, ay] = extractMoves(input[0]);
  const [bx, by] = extractMoves(input[1]);

  const [px, py] = extractPrize(input[2]);

  // px == ax * a + bx * b
  // py == ay * a + by * b
  for (let a = 1; a <= 100; a++) {
    for (let b = 1; b <= 100; b++) {
      if (px == ax * a + bx * b && py == ay * a + by * b) {
        tokens += a * 3 + b;
      }
    }
  }

  // console.log(ax, ay);
  // console.log(bx, by);
  // console.log(px, py);
}

console.log("tokens: ", tokens);
