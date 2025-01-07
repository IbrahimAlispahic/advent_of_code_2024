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
const testInputPt2 = `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`;

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

function transformMapPart2(
  grid: string[][],
  robot: Position,
  boxes: Position[]
) {
  const height = grid.length;
  const width = grid[0].length;

  const newWidth = width * 2;
  const newGrid = Array.from({ length: height }, () =>
    Array(newWidth).fill(".")
  );

  // '#' -> '##'
  // 'O' -> '[]'
  // '.' -> '..'
  // '@' -> '@.' (robot one cell)
  // Place robot after transformation:
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const cell = grid[r][c];
      const newC = c * 2;
      if (r === robot.row && c === robot.col) {
        newGrid[r][newC] = "@";
        if (newC + 1 < newWidth) newGrid[r][newC + 1] = ".";
      } else {
        if (cell === "#") {
          newGrid[r][newC] = "#";
          newGrid[r][newC + 1] = "#";
        } else if (cell === "O") {
          newGrid[r][newC] = "[";
          newGrid[r][newC + 1] = "]";
        } else if (cell === ".") {
          newGrid[r][newC] = ".";
          newGrid[r][newC + 1] = ".";
        }
      }
    }
  }

  // Robot new position
  const newRobot: Position = { row: robot.row, col: robot.col * 2 };
  const newBoxes: Position[] = boxes.map((b) => ({
    row: b.row,
    col: b.col * 2,
  }));

  return { newGrid, newRobot, newBoxes };
}

function isWall(grid: string[][], r: number, c: number): boolean {
  return (
    r < 0 ||
    r >= grid.length ||
    c < 0 ||
    c >= grid[0].length ||
    grid[r][c] === "#"
  );
}

function isBox(grid: string[][], r: number, c: number): boolean {
  return (
    r >= 0 &&
    r < grid.length &&
    c >= 0 &&
    c + 1 < grid[0].length &&
    grid[r][c] === "[" &&
    grid[r][c + 1] === "]"
  );
}

function tryPushBoxes(
  grid: string[][],
  startRow: number,
  startCol: number,
  dr: number,
  dc: number
): boolean {
  let chain: [number, number][] = [];
  let curR = startRow;
  let curC = startCol;

  while (true) {
    if (curR < 0 || curR >= grid.length || curC < 0 || curC >= grid[0].length)
      return false;
    if (!isBox(grid, curR, curC)) {
      // Not a box
      if (isWall(grid, curR, curC)) return false;
      break;
    } else {
      // We found `[`
      chain.push([curR, curC]);
      curR += dr;
      curC += dc;
    }
  }

  // Push boxes forward by one cell in direction (dr, dc)
  // Move from last to first
  for (let i = chain.length - 1; i >= 0; i--) {
    const [br, bc] = chain[i];
    // Clear old pos
    grid[br][bc] = ".";
    grid[br][bc + 1] = ".";
    const nbr = br + dr;
    const nbc = bc + dc;
    if (nbr < 0 || nbr >= grid.length || nbc < 0 || nbc + 1 >= grid[0].length)
      return false;
    grid[nbr][nbc] = "[";
    grid[nbr][nbc + 1] = "]";
  }

  return true;
}

function simulate(grid: string[][], moves: string, robot: Position) {
  for (const move of moves) {
    const { dr, dc } = DIRECTIONS[move as DirectionKey];
    const nr = robot.row + dr;
    const nc = robot.col + dc;

    if (isWall(grid, nr, nc)) continue;

    if (isBox(grid, nr, nc)) {
      if (!tryPushBoxes(grid, nr, nc, dr, dc)) {
        continue;
      }
    }

    // Move robot
    // Clear old
    grid[robot.row][robot.col] = ".";
    if (robot.col + 1 < grid[0].length) grid[robot.row][robot.col + 1] = ".";

    robot.row = nr;
    robot.col = nc;

    grid[robot.row][robot.col] = "@";
    if (robot.col + 1 < grid[0].length) grid[robot.row][robot.col + 1] = ".";
  }
}

// Calculate the GPS sum
function calculateGPS(grid: string[][]): number {
  let sum = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "[") {
        // GPS = 100*row + col_of_[
        sum += 100 * r + c;
      }
    }
  }
  return sum;
}

function printGrid(grid: string[][]): void {
  console.log(grid.map((row) => row.join("")).join("\n"));
  console.log("\n");
}

// Main execution
const { grid: part1Grid, moves, robot, boxes } = parseInput(testInput);
const { newGrid, newRobot } = transformMapPart2(part1Grid, robot, boxes);

printGrid(newGrid);
simulate(newGrid, moves, newRobot);
printGrid(newGrid);

const gpsSum = calculateGPS(newGrid);

console.log("Sum of GPS Coordinates:", gpsSum);
