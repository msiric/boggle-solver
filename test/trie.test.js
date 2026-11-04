import { test } from "node:test";
import assert from "node:assert/strict";
import { Trie } from "../trie.js";

const build = (words) => {
  const trie = new Trie();
  for (const w of words) trie.insert(w);
  return trie;
};

test("contains matches only whole inserted words", () => {
  const trie = build(["cat", "cats", "dog"]);
  assert.equal(trie.contains("cat"), true);
  assert.equal(trie.contains("cats"), true);
  assert.equal(trie.contains("dog"), true);
  assert.equal(trie.contains("ca"), false);
  assert.equal(trie.contains("catsup"), false);
  assert.equal(trie.contains("cow"), false);
  assert.equal(trie.contains(""), false);
});

test("hasPrefix is true for prefixes and whole words only", () => {
  const trie = build(["cat", "cats", "dog"]);
  for (const p of ["", "c", "ca", "cat", "cats", "d", "do", "dog"]) {
    assert.equal(trie.hasPrefix(p), true, p);
  }
  for (const p of ["x", "cb", "catsu", "dogs"]) {
    assert.equal(trie.hasPrefix(p), false, p);
  }
});

test("getNode walks from a given node", () => {
  const trie = build(["cat", "cats"]);
  const ca = trie.getNode("ca");
  assert.ok(ca);
  assert.equal(trie.getNode("t", ca), trie.getNode("cat"));
  assert.equal(trie.getNode("t", ca).end, true);
  assert.equal(trie.getNode("ts", ca).end, true);
  assert.equal(trie.getNode("x", ca), null);
  assert.equal(trie.getNode("", ca), ca);
});

test("blank words are ignored", () => {
  const trie = build(["", "   "]);
  assert.deepEqual(trie.root.children, {});
});

test("words named like Object.prototype members are not special", () => {
  const trie = build(["constructor"]);
  assert.equal(trie.contains("constructor"), true);
  assert.equal(trie.hasPrefix("toString"), false);
  assert.equal(trie.contains("toString"), false);
});
