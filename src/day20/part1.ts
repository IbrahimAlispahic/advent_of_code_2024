import * as fs from "fs";

type Point = [number, number];
type Cheat = {
  start: Point;
  end: Point;
  savedTime: number;
};

function parseInput(input: string): {
  grid: string[][];
  start: Point;
  end: Point;
} {
  const grid: string[][] = [];
  let start: Point = [0, 0];
  let end: Point = [0, 0];

  input.split("\n").forEach((line, row) => {
    const rowArray = line.split("");
    grid.push(rowArray);
    rowArray.forEach((char, col) => {
      if (char === "S") start = [row, col];
      if (char === "E") end = [row, col];
    });
  });

  return { grid, start, end };
}

function bfs(grid: string[][], start: Point, end: Point): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions: Point[] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const distances: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(Infinity)
  );

  const queue: Array<[number, number, number]> = [[...start, 0]];

  while (queue.length > 0) {
    const [r, c, d] = queue.shift()!;
    if (distances[r][c] <= d) continue;

    distances[r][c] = d;
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] !== "#"
      ) {
        queue.push([nr, nc, d + 1]);
      }
    }
  }

  return distances;
}

function calculateCheats(
  grid: string[][],
  distances: number[][]
): Cheat[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const directions: Point[] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const cheats: Cheat[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "#") continue;

      for (const [dr1, dc1] of directions) {
        const sr = r + dr1;
        const sc = c + dc1;
        if (
          sr < 0 ||
          sr >= rows ||
          sc < 0 ||
          sc >= cols ||
          grid[sr][sc] === "#"
        )
          continue;

        for (const [dr2, dc2] of directions) {
          const er = r + dr2;
          const ec = c + dc2;
          if (
            er < 0 ||
            er >= rows ||
            ec < 0 ||
            ec >= cols ||
            grid[er][ec] === "#"
          )
            continue;

          const startDistance = distances[sr][sc];
          const endDistance = distances[er][ec];
          if (
            startDistance === Infinity ||
            endDistance === Infinity ||
            startDistance >= endDistance
          )
            continue;

          const savedTime = endDistance - startDistance - 2;
          if (savedTime > 0) {
            cheats.push({
              start: [sr, sc],
              end: [er, ec],
              savedTime,
            });
          }
        }
      }
    }
  }

  return cheats;
}

function countCheats(input: string, minSave: number): number {
  const { grid, start, end } = parseInput(input);
  const distances = bfs(grid, start, end);
  const cheats = calculateCheats(grid, distances);

  return cheats.filter((cheat) => cheat.savedTime >= minSave).length;
}

// Example usage:
const testInput = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`;

const input = fs.readFileSync("./src/day20/input.txt", "utf-8");

console.log(countCheats(input, 100)); // Replace 100 with the required picoseconds
