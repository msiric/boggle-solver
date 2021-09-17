import { trie } from "./main.js";

const inputs = document.getElementsByClassName("input");
const size = document.getElementById("size").valueAsNumber;

const movements = (i, j) => [
  { row: i, column: j + 1, move: "RIGHT" },
  { row: i + 1, column: j + 1, move: "BOTTOM_RIGHT" },
  { row: i + 1, column: j, move: "BOTTOM" },
  { row: i + 1, column: j - 1, move: "BOTTOM_LEFT" },
  { row: i, column: j - 1, move: "LEFT" },
  { row: i - 1, column: j - 1, move: "TOP_LEFT" },
  { row: i - 1, column: j, move: "TOP" },
  { row: i - 1, column: j + 1, move: "TOP_RIGHT" },
];

export const findWords = (matrix) => {
  const words = [];
  const map = {};
  const iterate = (i, j, word, visited) => {
    if (matrix[i] && matrix[i][j]) {
      if (!visited[`${i}_${j}`]) {
        inputs[j + size * i].classList.toggle(".highlight");
        visited[`${i}_${j}`] = true;
        word += matrix[i][j];
        if (trie.find(word).length) {
          if (trie.contains(word) && !map[word]) {
            words.push(word);
            map[word] = true;
          }
          const moves = movements(i, j);
          for (let move of moves) {
            const { row, column } = move;
            iterate(row, column, word, { ...visited });
          }
        }
      }
    }
  };
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      iterate(i, j, "", {});
    }
  }
  return words;
};
