import * as fs from "fs";

// Read input and solve
const input = fs.readFileSync("./src/day19/input.txt", "utf-8");
const testInput = `r, wr, b, g, bwu, rb, gb, br

bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
brwrr`;

const [patterns, designs] = testInput.split("\n\n");

const towelPatterns = patterns.split(", ");
const towelDesigns = designs.split("\n");

console.log("towelPatterns: ", towelPatterns);
console.log("towelDesigns: ", towelDesigns);

function countPossibleDesigns(
  towelPatterns: string[],
  towelDesigns: string[]
): number {
  const towelSet = new Set(towelPatterns);
  let possibleCount = 0;

  for (const design of towelDesigns) {
    const n = design.length;
    const dp = Array(n + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= n; i++) {
      for (const pattern of towelSet) {
        const patternLength = pattern.length;
        if (i >= patternLength && dp[i - patternLength]) {
          if (design.slice(i - patternLength, i) === pattern) {
            dp[i] = true;
            break;
          }
        }
      }
    }
    if (dp[n]) possibleCount++;
  }
  return possibleCount;
}

console.log(
  "possible designs: ",
  countPossibleDesigns(towelPatterns, towelDesigns)
);
