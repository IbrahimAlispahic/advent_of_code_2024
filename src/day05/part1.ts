import * as fs from "fs";

const day = process.env.DAY;
const input = fs.readFileSync(`./src/day05/input.txt`, "utf-8");
// const input = `47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13

// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47`;

const [rules, pageNumbers] = input.split("\n\n");

const rulesMap = new Map<number, number[]>();

rules.split("\n").map((row) => {
  const [key, value] = row.split("|").map((el) => Number(el));
  if (rulesMap.has(key)) {
    rulesMap.get(key)!.push(value);
  } else {
    rulesMap.set(key, [value]);
  }
});

console.log(rulesMap);

const pages = pageNumbers
  .split("\n")
  .map((arr) => arr.split(",").map((el) => Number(el)));

console.log(pages);

function checkIfPageCorrect(page: number[]) {
  let ruleBroken1 = false;
  let ruleBroken2 = false;

  for (const el of page) {
    const currIndex = page.indexOf(el);

    const elementsBefore = page.slice(0, currIndex);
    const elementVaues = rulesMap.get(el);
    if (elementVaues) {
      ruleBroken1 = elementsBefore.some((element) =>
        elementVaues.includes(element)
      );
      if (ruleBroken1) {
        break;
      }
    }

    const elementsAfter = page.slice(currIndex, page.length);

    for (const elementAfter of elementsAfter) {
      const elementAfterVaues = rulesMap.get(elementAfter);

      if (elementAfterVaues) {
        ruleBroken2 = elementAfterVaues.includes(el);
        if (ruleBroken2) {
          break;
        }
      }
    }
  }
  return !ruleBroken1 && !ruleBroken2;
}

function findCorrectPages() {
  let score = 0;

  for (const page of pages) {
    if (checkIfPageCorrect(page)) {
      const middleIndex = Math.floor(page.length / 2);
      score += page[middleIndex];
    }
  }
  return score;
}

console.log("score: ", findCorrectPages());
