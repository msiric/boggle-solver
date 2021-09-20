import { findWords } from "./solver.js";
import { list } from "./dictionary.js";
import { Trie } from "./trie.js";

const CHARACTERS = "abcdefghijklmnopqrstuvwxyz";

const REFERENCES = {
  table: "",
  size: "",
  resize: "",
  solve: "",
  cells: "",
  counters: "",
  result: "",
  list: "",
  length: "",
  inputs: "",
  highlights: "",
};

export let trie;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const toggleAttributes = () => {
  updateReferences();
  const { inputs } = REFERENCES;
  solve.disabled = !solve.disabled;
  resize.disabled = !resize.disabled;
  for (let input of inputs) {
    input.readOnly = !input.readOnly;
  }
};

const visualizeSteps = async (steps, inputs, counters, size) => {
  for (let step of steps) {
    const { x, y } = step;
    const selection = y + size * x;
    await delay(0);
    if (counters[selection].innerHTML === "") {
      counters[selection].innerHTML = step.counter;
    }
    inputs[selection].classList.add("highlight");
    if (step.isWord) {
      updateReferences();
      const { highlights } = REFERENCES;
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
        counters[selection].innerHTML = "";
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

const handleSubmit = async (e) => {
  e.preventDefault();
  updateReferences();
  const { cells, counters, result, list } = REFERENCES;
  const { length } = REFERENCES.table.children;
  result.style.display = "none";
  list.innerHTML = "";
  toggleAttributes();
  const matrix = [];
  for (let i = 0; i < length; i++) {
    const row = [];
    for (let j = 0; j < length; j++) {
      row.push(cells[j + length * i].value.toLowerCase());
    }
    matrix.push(row);
  }
  const { words, steps } = findWords(matrix);
  const sorted = words.sort((a, b) => b.length - a.length);
  createTable(sorted, list);
  result.style.display = "block";
  await visualizeSteps(steps, cells, counters, length);
};

const resizeGrid = (e) => {
  e.preventDefault();
  if (!size.value) return;
  table.innerHTML = "";
  for (let i = 0; i < size.valueAsNumber; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < size.valueAsNumber; j++) {
      const data = document.createElement("td");
      const input = document.createElement("input");
      const span = document.createElement("span");
      input.required = true;
      input.setAttribute("maxLength", 1);
      input.classList.add("cell");
      span.classList.add("counter");
      data.appendChild(input);
      data.appendChild(span);
      row.appendChild(data);
    }
    table.appendChild(row);
  }
  randomizeGrid();
};

const randomizeGrid = () => {
  updateReferences();
  const { cells } = REFERENCES;
  for (let cell of cells) {
    cell.value = CHARACTERS.charAt(
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

const updateReferences = () => {
  REFERENCES.table = document.getElementById("table");
  REFERENCES.size = document.getElementById("size");
  REFERENCES.resize = document.getElementById("resize");
  REFERENCES.solve = document.getElementById("solve");
  REFERENCES.cells = document.querySelectorAll(".cell");
  REFERENCES.counters = document.querySelectorAll(".counter");
  REFERENCES.result = document.getElementById("result");
  REFERENCES.list = document.getElementById("list");
  REFERENCES.inputs = document.querySelectorAll("input");
  REFERENCES.highlights = document.getElementsByClassName("highlight");
};

const initializeApp = (e) => {
  updateReferences();
  resizeGrid(e);
  instantiateTrie();
  const form = document.querySelector("#form");
  const toolbar = document.querySelector("#toolbar");
  toolbar.onsubmit = resizeGrid;
  form.onsubmit = handleSubmit;
};

window.addEventListener("DOMContentLoaded", initializeApp);
