import { findWords } from "./solver.js";
import { list } from "./dictionary.js";
import { Trie } from "./trie.js";

const CHARACTERS = "abcdefghijklmnopqrstuvwxyz";

const table = document.getElementById("table");
const size = document.getElementById("size");
const resize = document.getElementById("resize");
const solve = document.getElementById("solve");

export let trie;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const toggleAttributes = () => {
  const inputs = document.querySelectorAll("input");
  solve.disabled = !solve.disabled;
  resize.disabled = !resize.disabled;
  for (let input of inputs) {
    input.readOnly = !input.readOnly;
  }
};

const visualizeSteps = async (steps, inputs, spans, size) => {
  for (let step of steps) {
    const { x, y } = step;
    const selection = y + size * x;
    await delay(0);
    if (spans[selection].innerHTML === "") {
      spans[selection].innerHTML = step.counter;
    }
    inputs[selection].classList.add("highlight");
    if (step.isWord) {
      const highlights = document.getElementsByClassName("highlight");
      for (let highlight of highlights) {
        highlight.classList.add("success");
      }
      await delay(500);
      for (let highlight of highlights) {
        highlight.classList.remove("success");
      }
    } else {
      if (step.action === "remove") {
        await delay(0);
        inputs[selection].classList.remove("highlight");
        spans[selection].innerHTML = "";
      }
    }
  }
  toggleAttributes();
};

const createTable = (words, table) => {
  const heading = document.createElement("tr");
  const label = document.createElement("th");
  const size = document.createElement("th");
  label.innerHTML = "Word";
  size.innerHTML = "Length";
  heading.appendChild(label);
  heading.appendChild(size);
  table.appendChild(heading);
  for (let i = 0; i < words.length; i++) {
    const row = document.createElement("tr");
    const word = document.createElement("td");
    const length = document.createElement("td");
    word.innerHTML = words[i];
    length.innerHTML = words[i].length;
    row.appendChild(word);
    row.appendChild(length);
    table.appendChild(row);
  }
};

const handleChange = () => {
  resize.innerHTML = "Resize";
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll(".input");
  const spans = document.querySelectorAll(".span");
  const result = document.getElementById("result");
  const list = document.getElementById("list");
  const size = document.getElementById("table").children.length;
  result.style.display = "none";
  resize.innerHTML = "Resize";
  list.innerHTML = "";
  toggleAttributes();
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(inputs[j + size * i].value.toLowerCase());
    }
    matrix.push(row);
  }
  const { words, steps } = findWords(matrix);
  const sorted = words.sort((a, b) => b.length - a.length);
  createTable(sorted, list);
  result.style.display = "block";
  await visualizeSteps(steps, inputs, spans, size);
};

const resizeGrid = (e) => {
  e.preventDefault();
  resize.innerHTML = "Randomize";
  table.innerHTML = "";
  for (let i = 0; i < size.valueAsNumber; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < size.valueAsNumber; j++) {
      const data = document.createElement("td");
      const input = document.createElement("input");
      const span = document.createElement("span");
      input.required = true;
      input.classList.add("input");
      span.classList.add("span");
      data.appendChild(input);
      data.appendChild(span);
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

const instantiateTrie = () => {
  trie = new Trie();

  for (let item of list) {
    trie.insert(item);
  }
};

const initializeApp = (e) => {
  resizeGrid(e);
  instantiateTrie();
  const form = document.querySelector("#form");
  const toolbar = document.querySelector("#toolbar");
  toolbar.onsubmit = resizeGrid;
  form.onsubmit = handleSubmit;
  size.addEventListener("change", handleChange);
};

window.addEventListener("DOMContentLoaded", initializeApp);
