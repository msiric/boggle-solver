import { findWords } from "./solver.js";

const CHARACTERS = "abcdefghijklmnopqrstuvwxyz";

const test = [
  ["f", "x", "i", "e"],
  ["a", "m", "l", "o"],
  ["e", "w", "b", "x"],
  ["a", "s", "t", "u"],
];
const test2 = [
  ["f", "x", "i", "e", "a"],
  ["a", "m", "l", "o", "u"],
  ["e", "w", "b", "x", "i"],
  ["a", "s", "t", "u", "e"],
  ["s", "t", "h", "g", "n"],
];
const test3 = [
  ["f", "x", "i", "e", "a", "o"],
  ["a", "m", "l", "o", "u", "e"],
  ["e", "w", "b", "x", "i", "o"],
  ["a", "s", "t", "u", "e", " i"],
  ["s", "t", "h", "g", "n", "u"],
  ["d", "f", "a", "p", "e", "v"],
];
const test4 = [
  ["f", "x", "i", "e", "a", "o", "a", "p"],
  ["a", "m", "l", "o", "u", "e", "e", "x"],
  ["e", "w", "b", "x", "i", "o", "j", "m"],
  ["a", "s", "t", "u", "e", " i", "r", "i"],
  ["s", "t", "h", "g", "n", "u", "k", "e"],
  ["d", "f", "a", "p", "e", "v", "x", "r"],
  ["d", "f", "a", "p", "e", "v", "i", "j"],
  ["s", "l", "n", "e", "a", "r", "e", "s"],
];

const handleSubmit = (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll(".input");
  const result = document.getElementById("result");
  const size = document.getElementById("size").valueAsNumber;
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(inputs[j + size * i].value.toLowerCase());
    }
    matrix.push(row);
  }
  const words = findWords(matrix);
  result.innerHTML = words;
};

const resizeGrid = (e) => {
  e.preventDefault();
  const table = document.getElementById("table");
  const size = document.getElementById("size").valueAsNumber;
  table.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < size; j++) {
      const data = document.createElement("td");
      const input = document.createElement("input");
      input.required = true;
      input.classList.add("input");
      data.appendChild(input);
      row.appendChild(data);
    }
    table.appendChild(row);
  }
  randomizeGrid();
};

const randomizeGrid = () => {
  const inputs = document.querySelectorAll(".input");
  for (let input of inputs) {
    input.value = CHARACTERS.charAt(
      Math.floor(Math.random() * CHARACTERS.length)
    );
  }
};

const initializeApp = (e) => {
  resizeGrid(e);
  const form = document.querySelector("#form");
  const toolbar = document.querySelector("#toolbar");
  toolbar.onsubmit = resizeGrid;
  form.onsubmit = handleSubmit;
};

window.addEventListener("DOMContentLoaded", initializeApp);
