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

const addStep = (() => {
  let counter = 1;
  return (i, j, matrix, isWord, action, steps) => {
    steps.push({
      x: i,
      y: j,
      c: matrix[i][j],
      isWord,
      action,
      counter,
    });
    action === "remove" ? counter-- : counter++;
  };
})();

export const findWords = (matrix, trie) => {
  const words = [];
  const map = {};
  const steps = [];
  const iterate = (i, j, word, node, visited) => {
    if (matrix[i] && matrix[i][j]) {
      if (!visited[`${i}_${j}`]) {
        visited[`${i}_${j}`] = true;
        word += matrix[i][j];
        addStep(i, j, matrix, false, "add", steps);
        const next = trie.getNode(matrix[i][j], node);
        if (next) {
          if (next.end && !map[word]) {
            words.push(word);
            map[word] = true;
            steps[steps.length - 1] = {
              ...steps[steps.length - 1],
              isWord: true,
            };
          }
          const moves = movements(i, j);
          for (let move of moves) {
            const { row, column } = move;
            iterate(row, column, word, next, { ...visited });
          }
          addStep(i, j, matrix, false, "remove", steps);
        } else {
          addStep(i, j, matrix, false, "remove", steps);
        }
      }
    }
  };
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      iterate(i, j, "", trie.root, {});
    }
  }
  return { words, steps };
};
