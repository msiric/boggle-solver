import { findWords } from "./solver.js";
import { list } from "./dictionary.js";
import { Trie } from "./trie.js";

const CHARACTERS = "abcdefghijklmnopqrstuvwxyz";

export let trie;

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
  /*   const sorted = words.sort((a, b) => {
    return b.length - a.length;
  });
  console.log(sorted[0]); */
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
};

window.addEventListener("DOMContentLoaded", initializeApp);
