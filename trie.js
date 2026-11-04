class Node {
  constructor(key) {
    this.key = key;
    this.children = {};
    this.end = false;
  }
}

export class Trie {
  constructor() {
    this.root = new Node(null);
  }
  insert(word) {
    if (!word.trim()) return undefined;
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!current.children[word[i]]) {
        current.children[word[i]] = new Node(word[i]);
      }

      current = current.children[word[i]];

      if (i === word.length - 1) {
        current.end = true;
      }
    }
  }
  contains(word = "") {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!current.children[word[i]]) {
        return false;
      }
      current = current.children[word[i]];
    }
    return current.end;
  }
  getNode(prefix = "", from = this.root) {
    let current = from;
    for (let i = 0; i < prefix.length; i++) {
      current = current.children[prefix[i]];
      if (!current) return null;
    }
    return current;
  }
  hasPrefix(prefix = "") {
    return this.getNode(prefix) !== null;
  }
}
