# Boggle Solver

Project made to find an efficient algorithm of solving a Boggle game.
The point of the game is to find all valid words in sequences of adjacent letters.

Boggle solver in action: [Demo](https://peaceful-borg-3ffc14.netlify.app/)

## Features

The number of generated cells/rows can be modified (2 to 8) before running the algorithm and a table containing all valid words appears on completion.
An animation displaying every step of the algorithm runs afterwards, showing the path from the beginning to the end of the Boggle grid.
Words are matched against the Scrabble dictionary: https://github.com/benjamincrom/scrabble/blob/master/scrabble/dictionary.json

## Implementation

A recursive algorithm is used to iterate through all of the adjacent letters and test the validity of the word at a certain position using a trie data structure.
If the current word is not valid, there is no need to check for additional suffixes of the word and the program can safely skip to the next letter in the grid.
All of the steps are saved in order so that they can be animated later once the algorithm completes.

## License

MIT
