import { test } from "node:test";
import assert from "node:assert/strict";
import { Trie } from "../trie.js";
import { findWords } from "../solver.js";
import { findWords as originalFindWords } from "./fixtures/original-solver.js";
import { list } from "../dictionary.js";

const build = (words) => {
  const trie = new Trie();
  for (const w of words) trie.insert(w);
  return trie;
};

// Seeded so a failing board can be reproduced.
const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const randomBoard = (size, rand) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () =>
      "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(rand() * 26))
    )
  );

const BOARD = [
  ["c", "a", "t"],
  ["x", "s", "o"],
  ["d", "o", "g"],
];

test("finds exactly the words that can be traced on the board", () => {
  const trie = build([
    "cat",
    "cats",
    "tog",
    "dogs",
    "sod",
    "act",
    "catt",
    "dog",
    "zebra",
  ]);
  const { words } = findWords(BOARD, trie);
  assert.deepEqual(
    [...words].sort(),
    ["cat", "cats", "dog", "dogs", "sod", "tog"]
  );
});

test("a word reachable by several paths is reported once", () => {
  const board = [
    ["a", "a"],
    ["a", "a"],
  ];
  const { words } = findWords(board, build(["aa", "aaa", "aaaa", "aaaaa"]));
  assert.deepEqual(words, ["aa", "aaa", "aaaa"]);
});

test("no duplicates on a busy board with the real dictionary", () => {
  const trie = build(list);
  const board = [
    ["s", "e", "r", "s"],
    ["p", "a", "t", "g"],
    ["l", "i", "n", "e"],
    ["s", "e", "r", "s"],
  ];
  const { words } = findWords(board, trie);
  assert.ok(words.length > 100);
  assert.equal(new Set(words).size, words.length);
});

test("dictionary words that are Object.prototype keys are found", () => {
  const board = [
    ["c", "o", "n", "s"],
    ["r", "x", "x", "t"],
    ["o", "x", "x", "r"],
    ["t", "c", "u", "x"],
  ];
  const { words } = findWords(board, build(["constructor", "tostring"]));
  assert.deepEqual(words, ["constructor"]);
});

test("steps are balanced and flag each found word once", () => {
  const { words, steps } = findWords(BOARD, build(["cat", "cats", "dog"]));
  const adds = steps.filter((s) => s.action === "add").length;
  const removes = steps.filter((s) => s.action === "remove").length;
  assert.equal(adds, removes);
  assert.equal(steps.filter((s) => s.isWord).length, words.length);
});

test("matches the original solver (words and steps) on random boards", () => {
  const trie = build(list);
  const rand = mulberry32(2021);
  const sizes = [2, 3, 4, 4, 4, 4, 5, 5, 6, 8];
  for (const size of sizes) {
    const board = randomBoard(size, rand);
    const expected = originalFindWords(board, trie);
    const actual = findWords(board, trie);
    assert.deepEqual(actual.words, expected.words, JSON.stringify(board));
    assert.deepEqual(actual.steps, expected.steps, JSON.stringify(board));
  }
});
