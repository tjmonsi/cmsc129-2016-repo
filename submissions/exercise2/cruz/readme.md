Lexical Analyzer
===================

The **lex.js** is a javascript implementation of a lexical analyzer without using RegEx but with use of (Deterministic) Finite-state Automata implementation.

----------


Running the script
-------------

> **Requirements:**

> - Node.js
> - A file with correct lexemes (a ".cjs" file)

**Node.js**

To use, simply use the command below on the same directory as lex.js and <.cjs file>.
```
node lex.js <.cjs file>
```
The script will output the lexemes found on the file and will generate a "filename+ext.lex" file that contains the lexemes based on its analysis.