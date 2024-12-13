import * as fs from "fs";

const input = fs.readFileSync(`./src/day08/input.txt`, "utf-8");

const testInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`

function populateFreqMap(matrix: string[][]): Map<string, number[][]> {
  const freqMap = new Map<string, number[][]>();
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const symbol = matrix[row][col];
      if (symbol !== ".") {
        if (!freqMap.has(symbol)) {
          freqMap.set(symbol, []);
        }
        freqMap.get(symbol).push([row, col]);
      }
    }
  }
  return freqMap;
}

function calculateResonantAntinodes(matrix: string[][]): number {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const freqMap = populateFreqMap(matrix);
  const antinodes = new Set<string>();

  // Process each frequency
  freqMap.forEach((positions) => {
    // Add all positions as potential antinodes
    positions.forEach((pos) => antinodes.add(JSON.stringify(pos)));

    // Check every pair of antennas to find resonant antinodes
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [r1, c1] = positions[i];
        const [r2, c2] = positions[j];

        // Calculate the direction vector
        const rowDiff = r2 - r1;
        const colDiff = c2 - c1;

        // Generate all collinear points between and beyond the pair
        for (let k = -1; k <= 1; k += 2) {
          let r = r1 + k * rowDiff;
          let c = c1 + k * colDiff;

          while (r >= 0 && r < rows && c >= 0 && c < cols) {
            antinodes.add(JSON.stringify([r, c]));
            r += k * rowDiff;
            c += k * colDiff;
          }
        }
      }
    }
  });

  // Return unique count of antinodes
  return antinodes.size;
}

// Parse input and execute
const matrix = testInput.split("\n").map((row) => row.split(""));
const result = calculateResonantAntinodes(matrix);

console.log("Antinode Count:", result);