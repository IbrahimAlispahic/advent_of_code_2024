import * as fs from "fs";

// Read input and solve
const input = fs.readFileSync("./src/day16/input.txt", "utf-8");
const testInput = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

// Directions and their corresponding deltas
const DIRECTIONS = ["E", "S", "W", "N"];
const DELTAS: Record<"E" | "S" | "W" | "N", { dx: number; dy: number }> = {
  E: { dx: 0, dy: 1 },
  S: { dx: 1, dy: 0 },
  W: { dx: 0, dy: -1 },
  N: { dx: -1, dy: 0 },
};

type State = {
  x: number;
  y: number;
  direction: string;
  cost: number;
};

// Parse input to identify the maze, start, and end positions
function parseInput(input: string) {
  const grid = input.split("\n").map((line) => line.split(""));
  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") start = { x: i, y: j };
      if (grid[i][j] === "E") end = { x: i, y: j };
    }
  }

  return { grid, start, end };
}

function findBestPathTiles(
  grid: string[][],
  start: { x: number; y: number },
  end: { x: number; y: number }
) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Priority queue (min-heap)
  const queue: State[] = [];
  const visited = new Set<string>();
  const bestPathTiles = new Set<string>(); // Tiles part of the best path

  let minCost = Infinity; // Track the minimum cost

  // Push the starting state (facing East, cost 0)
  queue.push({ x: start.x, y: start.y, direction: "E", cost: 0 });

  while (queue.length > 0) {
    // Get the state with the lowest cost
    queue.sort((a, b) => a.cost - b.cost);
    const { x, y, direction, cost } = queue.shift()!;

    // If we exceed the minimum cost, stop exploring this path
    if (cost > minCost) continue;

    const stateKey = `${x},${y},${direction}`;
    if (visited.has(stateKey)) continue;
    visited.add(stateKey);

    // Mark the tile as part of the best path
    bestPathTiles.add(`${x},${y}`);

    // If we reach the end, update the minimum cost
    if (x === end.x && y === end.y) {
      minCost = Math.min(minCost, cost);
      continue;
    }

    // Explore all possible actions from the current state
    for (const [action, deltaCost] of [
      ["MOVE", 1], // Move forward
      ["CW", 1000], // Rotate clockwise
      ["CCW", 1000], // Rotate counterclockwise
    ] as const) {
      if (action === "MOVE") {
        // Moving forward
        const { dx, dy } = DELTAS[direction as "E" | "S" | "W" | "N"];
        const nx = x + dx;
        const ny = y + dy;

        // Check if the move is valid
        if (
          nx >= 0 &&
          nx < rows &&
          ny >= 0 &&
          ny < cols &&
          grid[nx][ny] !== "#"
        ) {
          queue.push({ x: nx, y: ny, direction, cost: cost + deltaCost });
        }
      } else {
        // Rotating
        const currentIndex = DIRECTIONS.indexOf(direction);
        const newIndex =
          action === "CW" ? (currentIndex + 1) % 4 : (currentIndex + 3) % 4; // CCW
        const newDirection = DIRECTIONS[newIndex];
        queue.push({ x, y, direction: newDirection, cost: cost + deltaCost });
      }
    }
  }

  return { minCost, bestPathTiles };
}

// Main Execution for Part 2
const { grid, start, end } = parseInput(input);

// Find all best path tiles
const { minCost, bestPathTiles } = findBestPathTiles(grid, start, end);

// Mark the tiles in the grid
const outputGrid = grid.map((row, x) =>
  row.map((cell, y) => (bestPathTiles.has(`${x},${y}`) ? "O" : cell))
);

// Count the number of tiles part of the best path
const bestPathTileCount = Array.from(bestPathTiles).length;

console.log("Updated Grid with Best Path Tiles:");
console.log(outputGrid.map((row) => row.join("")).join("\n"));
console.log("Number of Best Path Tiles:", bestPathTileCount);