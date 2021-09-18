import { findWords } from "./solver.js";
import { list } from "./dictionary.js";
import { Trie } from "./trie.js";

const CHARACTERS = "abcdefghijklmnopqrstuvwxyz";

export let trie;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const handleSubmit = async (e) => {
  e.preventDefault();
  const inputs = document.querySelectorAll(".input");
  const span = document.querySelectorAll(".span");
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
  const { words, steps } = findWords(matrix);
  result.innerHTML = words;
  for (let step of steps) {
    const { x, y } = step;
    const selection = y + size * x;
    await delay(0);
    if (span[selection].innerHTML === "") {
      span[selection].innerHTML = step.counter;
    }
    inputs[selection].classList.add("highlight");
    if (step.isWord) {
      const highlights = document.getElementsByClassName("highlight");
      for (let highlight of highlights) {
        highlight.classList.add("success");
      }
      await delay(1000);
      for (let highlight of highlights) {
        highlight.classList.remove("success");
      }
    } else {
      if (step.action === "remove") {
        await delay(0);
        inputs[selection].classList.remove("highlight");
        span[selection].innerHTML = "";
      }
    }
  }
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
};

window.addEventListener("DOMContentLoaded", initializeApp);
