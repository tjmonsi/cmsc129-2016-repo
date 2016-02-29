# Exercise 2 - Create a Lexical Analyzer Part 1

Lexical analysis is where you have to take in a stream of characters and put out an array of tokens called Lexemes. These tokens are the terminals of your Grammar rules. 

Part of the lexical analysis is to use Deterministic Finite Automata to determine those tokens... take this a simple example:

```
number := (-)?([0-9])*(\.)?([0-9])+
```

What it means that any pattern that has a possiblity of at most 1 `-` character, at least 0 characters from `0-9` with the possibility at most 1 `.` character, and at least 1 character from `0-9` should signify a number token. This is a regular expression for a number token (Please review your REGEX now).

Regular expressions can be turned into Deterministic Finite Automata or DFAs. Let's have a simple example

```
pattern := a*ba*
```

With this example, any pattern that has at least 0 characters of `a` then 1 `b` then at least 0 characters of `a` would be accepted as a token called `pattern`. In DFA, given that the alphabet is only composed of `a` and `b`, it will have:

```
 -- start --> q0 ----- b ---> q1* ---
          ^        |      ^         |
          |        |      |         |
          ---- a ---      ---- a ----
where q1 is the accepting state
```

## What you need to do

What you need to do is given a stream of characters from your file, you will have to create a 'universal' DFA that will accept the stream of characters, and depending on the 'accepting state', will output a stream of tokens via the console line. It will have to do the following

- take in one character at a time
- based on the character, change the state
- put out a stream of tokens based on your Grammar rules

## Constraints

- you will not use any form of regex. Just pure implemented version of REGEX
- characters can be from all the characters that can be typed in your keyboard

## How do you pass the exercise

- You will have to create a folder inside `submissions/exercise2` named `[surname-in-small-letters-one-word]`
- inside should have a `readme.md` file on how to run your exercise. For consistency, it should run on Linux Ubuntu flavor for now.
- It should also have an updated version of your grammar rules in `grammar.md`
- Any installation and dependencies should be kept to a minimum, if you still need anything, justify it in your `readme.md` and put a bash file named `dependencies.sh` to run all the commands needed to install those dependencies
  - currently, my system would only have node JS installed. You will need to specify in your `readme.md` what compiler you used and how to install and run the same compiler to a Linux Ubuntu system. Have the installation of the compiler named `compiler.sh`
- Create a `compiler-and-run.sh` bash file that would include the set of commands to compile and run your DFA implementation.
  - If you did everything above at your own laptop, try using an ubuntu-like cloud service like Cloud9 and try running it there. If it works, then you're good to go...
- Git commit and push to your own repo and then make a pull request to https://github.com/tjmonsi/cmsc129-2016-repo to submit your work. If it's not in my repo, it's not going to be graded.

## Deadlines
- Deadline for this exercise is on March 13, 2016 Sunday 11:59 PM