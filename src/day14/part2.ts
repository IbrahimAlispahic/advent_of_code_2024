import { createCanvas } from "canvas";
import * as fs from "fs";
import * as path from "path";

// Grid dimensions and simulation time
const WIDTH = 101;
const HEIGHT = 103;
const SIMULATION_TIME = 100;

// Input parsing function
function parseInput(input: string): { x: number; y: number; dx: number; dy: number }[] {
  return input.split("\n").map((line) => {
    const [pPart, vPart] = line.split(" v=");
    const [x, y] = pPart.slice(2).split(",").map(Number);
    const [dx, dy] = vPart.split(",").map(Number);
    return { x, y, dx, dy };
  });
}

// Function to render grid to image
function renderGrid(
  robots: { x: number; y: number }[],
  iteration: number
): void {
  const cellSize = 5; // Size of each cell in pixels
  const canvas = createCanvas(WIDTH * cellSize, HEIGHT * cellSize);
  const ctx = canvas.getContext("2d");

  // Fill background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, WIDTH * cellSize, HEIGHT * cellSize);

  // Draw robots
  ctx.fillStyle = "#ff0000"; // Red for robots
  for (const robot of robots) {
    const posX = (robot.x + WIDTH) % WIDTH; // Ensure positive wrapping
    const posY = (robot.y + HEIGHT) % HEIGHT;
    ctx.fillRect(posX * cellSize, posY * cellSize, cellSize, cellSize);
  }

  // Save image
  const outputPath = path.join(__dirname, `output_${iteration}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Rendered iteration ${iteration}: ${outputPath}`);
}

// Simulate robot movement and render images
function simulateAndRender(robots: { x: number; y: number; dx: number; dy: number }[]): void {
  for (let t = 0; t <= SIMULATION_TIME; t++) {
    const currentPositions = robots.map((robot) => {
      // Compute position with wrapping
      const finalX = (robot.x + robot.dx * t) % WIDTH;
      const finalY = (robot.y + robot.dy * t) % HEIGHT;

      // Ensure positive positions
      const posX = (finalX + WIDTH) % WIDTH;
      const posY = (finalY + HEIGHT) % HEIGHT;

      return { x: posX, y: posY };
    });

    // Render current state to image
    renderGrid(currentPositions, t);
  }
}

// Main execution
const input = fs.readFileSync("./src/day14/input.txt", "utf-8");
const robots = parseInput(input);

simulateAndRender(robots);