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
  find(prefix = "") {
    let current = this.root;
    for (let i = 0; i < prefix.length; i++) {
      if (!current.children[prefix[i]]) {
        return [];
      }
      current = current.children[prefix[i]];
    }
    const iterate = (prefix, node, words) => {
      const values = Object.values(node.children);
      for (let value of values) {
        if (value.end) words.push(prefix + value.key);
        iterate(prefix + value.key, value, words);
      }

      return words;
    };
    return iterate(prefix, current, [...(current.end ? [prefix] : [])]);
  }
}
