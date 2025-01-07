import * as fs from "fs";

const input = fs.readFileSync("./src/day15/input.txt", "utf-8");
const testInputSmall = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`;
const testInput = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

type DirectionKey = "<" | ">" | "^" | "v";

const DIRECTIONS: Record<DirectionKey, { dr: number; dc: number }> = {
  "<": { dr: 0, dc: -1 }, // Left
  ">": { dr: 0, dc: 1 }, // Right
  "^": { dr: -1, dc: 0 }, // Up
  v: { dr: 1, dc: 0 }, // Down
};

type Position = { row: number; col: number };

// Parse the input
function parseInput(input: string) {
  const [gridInput, movesInput] = input.split("\n\n");

  const grid = gridInput.split("\n").map((line) => line.split(""));
  const moves = movesInput.replace(/\n/g, ""); // Flatten move string

  let robot: Position = { row: 0, col: 0 };
  const boxes: Position[] = [];

  // Locate robot and boxes
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "@") {
        robot = { row: r, col: c };
        grid[r][c] = "."; // Replace robot position with empty space
      } else if (grid[r][c] === "O") {
        boxes.push({ row: r, col: c });
      }
    }
  }

  return { grid, moves, robot, boxes };
}

// Simulate the moves
function simulate(
  grid: string[][],
  moves: string,
  robot: Position,
  boxes: Position[]
) {
  const height = grid.length;
  const width = grid[0].length;

  const boxSet = new Set<string>(boxes.map(({ row, col }) => `${row},${col}`));

  function isWall(row: number, col: number): boolean {
    return grid[row][col] === "#";
  }

  function isBox(row: number, col: number): boolean {
    return boxSet.has(`${row},${col}`);
  }

  function tryPushBoxes(
    boxSet: Set<string>,
    startRow: number,
    startCol: number,
    dr: number,
    dc: number,
    grid: string[][]
  ): boolean {
    let chain: [number, number][] = [];
    let curR = startRow;
    let curC = startCol;

    // Collect all consecutive boxes in direction (dr, dc)
    while (true) {
      if (
        curR < 0 ||
        curR >= grid.length ||
        curC < 0 ||
        curC >= grid[0].length
      ) {
        // Out of bounds - can't push
        return false;
      }
      const key = `${curR},${curC}`;
      if (boxSet.has(key)) {
        chain.push([curR, curC]);
        curR += dr;
        curC += dc;
      } else {
        // Encountered a cell that's not a box
        // If it's a wall can't push
        if (grid[curR][curC] === "#") {
          return false;
        }
        // Otherwise, it's empty and we can push
        break;
      }
    }

    // Now push all boxes one step in the direction
    // Push from last to first to avoid overwriting
    for (let i = chain.length - 1; i >= 0; i--) {
      const [br, bc] = chain[i];
      boxSet.delete(`${br},${bc}`);
      boxSet.add(`${br + dr},${bc + dc}`);
    }

    return true;
  }

  for (const move of moves) {
    const { dr, dc } = DIRECTIONS[move as DirectionKey];
    const nr = robot.row + dr;
    const nc = robot.col + dc;

    // Check if wall
    if (isWall(nr, nc)) {
      // Move blocked by wall, skip
      continue;
    }

    // If there's a box
    if (isBox(nr, nc)) {
      // Try push chain of boxes
      if (!tryPushBoxes(boxSet, nr, nc, dr, dc, grid)) {
        // Cannot push, skip move
        continue;
      }
    }

    // Move robot into the new cell
    robot.row = nr;
    robot.col = nc;
  }

  return boxSet;
}

// Calculate the GPS sum
function calculateGPS(boxSet: Set<string>): number {
  let sum = 0;
  for (const box of boxSet) {
    const [row, col] = box.split(",").map(Number);
    sum += 100 * row + col;
  }
  return sum;
}

function printGrid(grid: string[][]): void {
  console.log(grid.map((row) => row.join("")).join("\n"));
  console.log("\n");
}

function populateGridWithBoxes(
  grid: string[][],
  boxPositions: Set<string>
): void {
  const updatedGrid = grid.map((row) =>
    row.map((element) => (element === "O" || element === "@" ? "." : element))
  );
  for (const boxPosition of boxPositions) {
    const [row, col] = boxPosition.split(",").map(Number);

    updatedGrid[row][col] = "O";
  }

  printGrid(updatedGrid);
}

// Main execution
const { grid, moves, robot, boxes } = parseInput(input);

// console.log("grid: ", grid);
// console.log("moves: ", moves);
// console.log("robot: ", robot);
// console.log("boxes: ", boxes);

printGrid(grid);

const finalBoxPositions = simulate(grid, moves, robot, boxes);

populateGridWithBoxes(grid, finalBoxPositions);

const gpsSum = calculateGPS(finalBoxPositions);

console.log("Sum of GPS Coordinates:", gpsSum);
