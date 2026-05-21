const cl = console.log;

import { rubric, rubricReady, createElement } from "./rubric.js";

// DOM Elements

const printBtn = document.getElementById("print-btn");
const rubricForm = document.querySelector(".rubric");
const scoreWrappers = {
  overall: document.getElementById("overall-score"),
  cleanliness: document.getElementById("clean-score"),
  organization: document.getElementById("organize-score"),
  feedback: document.getElementById("feedback-wrapper"),
};

(async () => {
  await rubricReady;
  rubric.sections.forEach((section) => rubricForm.append(section.el));
})();

rubricForm.addEventListener("submit", (e) => {
  e.preventDefault();
  window.scrollTo(0, document.body.scrollHeight);
  document.getElementById("calculate-btn").classList.add("hidden");
  const data = Object.fromEntries(new FormData(rubricForm));
  const scores = getScores(data);
  renderScoreWrappers(scores);
});

function getScores(data) {
  const scores = {};
  scores.overall = Object.values(data).reduce((sum, val) => sum + Number(val), 0) / 10 || "0";
  scores.feedback = rubric.getScoreMeaning(scores.overall);
  rubric.sections.forEach((section) => {
    const scoreKey = section.name.toLowerCase();
    const sectionEntries = Object.entries(data).filter(([key]) => key.endsWith(`[${section.name}]`));
    const sectionSum = sectionEntries.reduce((sum, [, value]) => sum + Number(value), 0);
    const computedScore = ((sectionSum / section.max_points) * 10).toFixed(1);
    const formattedScore = Number(computedScore).toString();

    scores[scoreKey] = formattedScore;
  });

  return scores;
}

function renderScoreWrappers(scores) {
  Object.keys(scores).forEach((key) => {
    const keyEl = createElement("span", ["key"], key);
    const valueEl = createElement("span", ["value"], scores[key]);
    scoreWrappers[`${key}`].replaceChildren(keyEl, valueEl);
  });
}

printBtn.addEventListener("click", () => window.print());
