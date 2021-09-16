import { list } from "./dictionary.js";
import { Trie } from "./trie.js";

const trie = new Trie();

for (let item of list) {
  trie.insert(item);
}

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
  const iterate = (i, j, word, visited) => {
    if (matrix[i] && matrix[i][j]) {
      if (!visited[`${i}_${j}`]) {
        visited[`${i}_${j}`] = true;
        word += matrix[i][j];
        if (trie.find(word).length) {
          if (trie.contains(word)) {
            words.push(word);
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
