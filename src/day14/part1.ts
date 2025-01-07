import * as fs from "fs";

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

// Simulate robot movement
function simulateRobots(robots: { x: number; y: number; dx: number; dy: number }[]): number {
  const centerX = Math.floor(WIDTH / 2);
  const centerY = Math.floor(HEIGHT / 2);

  // Quadrant counts
  let topLeft = 0, topRight = 0, bottomLeft = 0, bottomRight = 0;

  // Simulate movement for each robot after 100 seconds
  for (const robot of robots) {
    // Compute final position after 100 seconds with wrapping
    const finalX = (robot.x + robot.dx * SIMULATION_TIME) % WIDTH;
    const finalY = (robot.y + robot.dy * SIMULATION_TIME) % HEIGHT;

    // Ensure positive positions due to negative wrapping
    const posX = (finalX + WIDTH) % WIDTH;
    const posY = (finalY + HEIGHT) % HEIGHT;

    // Determine which quadrant the robot is in
    if (posX === centerX || posY === centerY) continue; // Ignore robots on the center lines

    if (posX < centerX && posY < centerY) topLeft++;
    else if (posX > centerX && posY < centerY) topRight++;
    else if (posX < centerX && posY > centerY) bottomLeft++;
    else if (posX > centerX && posY > centerY) bottomRight++;
  }

  // Safety factor is the product of robot counts in the 4 quadrants
  return topLeft * topRight * bottomLeft * bottomRight;
}

// Main execution
const input = fs.readFileSync("./src/day14/input.txt", "utf-8");
const robots = parseInput(input);

const safetyFactor = simulateRobots(robots);
console.log("Safety Factor:", safetyFactor);