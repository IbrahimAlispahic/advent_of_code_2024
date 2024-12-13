import * as fs from "fs";

// Read input and solve
const input = fs.readFileSync("./src/day12/input.txt", "utf-8");
const testInput1 = `AAAA
BBCD
BBCC
EEEC`;
const testInput2 = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

const matrix = input.split("\n").map((row) => row.split(""));

// console.log("matrix: ", matrix);

function findRegions(grid: string[][]) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]; // Down, Up, Right, Left

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  // Determine sides by counting corners
  function countSidesFromCorners(regionCells: [number, number][]): number {
    const cellSet = new Set(regionCells.map(([r, c]) => `${r},${c}`));

    // Find bounding box to limit corner checks
    let minR = Infinity,
      maxR = -Infinity,
      minC = Infinity,
      maxC = -Infinity;
    for (const [r, c] of regionCells) {
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
      if (c < minC) minC = c;
      if (c > maxC) maxC = c;
    }

    // We'll check corners in range [minR, maxR+1] x [minC, maxC+1]
    // Because the region is within this box, no need to check beyond
    let cornersCount = 0;

    for (let R = minR; R <= maxR + 1; R++) {
      for (let C = minC; C <= maxC + 1; C++) {
        // Check up to four cells: (R-1,C-1), (R-1,C), (R,C-1), (R,C)
        const cells = [
          [R - 1, C - 1],
          [R - 1, C],
          [R, C - 1],
          [R, C],
        ];

        let insideCount = 0;
        let insideCells: [number, number][] = [];
        for (const [cr, cc] of cells) {
          if (cellSet.has(`${cr},${cc}`)) {
            insideCount++;
            insideCells.push([cr, cc]);
          }
        }

        // Apply corner logic
        if (insideCount === 1 || insideCount === 3) {
          // Definitely a corner
          cornersCount++;
        } else if (insideCount === 2) {
          // Check if diagonal or adjacent
          // Extract coords for insideCells
          // If they share the same row or same column, it's straight line -> no corner
          // If they differ in both row and col, it's diagonal -> corner
          if (insideCells.length === 2) {
            const [[r1, c1], [r2, c2]] = insideCells;
            if (r1 !== r2 && c1 !== c2) {
              // diagonal -> corner
              cornersCount += 2;
            } else {
              // same row or same col -> straight line (no corner)
            }
          }
        } else {
          // 0 or 4 inside means no boundary corner
        }
      }
    }

    return cornersCount;
  }

  function bfs(startRow: number, startCol: number, type: string) {
    const queue = [[startRow, startCol]];
    const region: [number, number][] = [];

    let area = 0;
    const boundary: [number, number][] = [];

    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      if (visited[row][col]) continue;

      visited[row][col] = true;
      region.push([row, col]);
      area++;
      let isBoundary = false;
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          grid[newRow][newCol] === type
        ) {
          queue.push([newRow, newCol]);
        }
      }
      if (isBoundary) boundary.push([row, col]);
    }
    const sides = countSidesFromCorners(region);
    return { region, area, sides };
  }

  const regions = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!visited[row][col]) {
        regions.push(bfs(row, col, grid[row][col]));
      }
    }
  }
  let result = 0;
  regions.forEach((region) => {
    result += region.area * region.sides;
    console.log(region);
  });
  console.log("result: ", result);
}

findRegions(matrix);
