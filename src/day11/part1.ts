const input = `8069 87014 98 809367 525 0 9494914 5`;

console.time("Execution Time");

// Parse input
const initialStones = input.split(" ").map(Number);

function processBlinks(stones: number[], blinks: number) {
  const stoneCounts = new Map();

  // Initialize map with initial stones
  for (const stone of stones) {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
  }

  for (let i = 0; i < blinks; i++) {
    const newCounts = new Map();

    for (const [stone, count] of stoneCounts) {
      if (stone === 0) {
        // Rule 1: Replace 0 with 1
        newCounts.set(1, (newCounts.get(1) || 0) + count);
      } else if (String(stone).length % 2 === 0) {
        // Rule 2: Split even-length stone into two
        const str = String(stone);
        const left = parseInt(str.slice(0, str.length / 2), 10);
        const right = parseInt(str.slice(str.length / 2), 10);
        newCounts.set(left, (newCounts.get(left) || 0) + count);
        newCounts.set(right, (newCounts.get(right) || 0) + count);
      } else {
        // Rule 3: Multiply stone by 2024
        const newStone = stone * 2024;
        newCounts.set(newStone, (newCounts.get(newStone) || 0) + count);
      }
    }

    stoneCounts.clear();
    for (const [stone, count] of newCounts) {
      stoneCounts.set(stone, count);
    }

    console.log(
      `Blink ${i + 1}: Number of unique stones = ${stoneCounts.size}`
    );
  }

  // Sum total stones after all blinks
  let totalStones = 0;
  for (const count of stoneCounts.values()) {
    totalStones += count;
  }

  return totalStones;
}

const blinks = 75;
const result = processBlinks(initialStones, blinks);

console.timeEnd("Execution Time");
console.log("Total number of stones after", blinks, "blinks:", result);
