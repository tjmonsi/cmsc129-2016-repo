Syntax Analyzer
===================

The **syn.js** is a javascript implementation of a lexical analyzer with syntax analysis without using RegEx but with use of (Deterministic) Finite-state Automata implementation.

----------

Specifications
-------------

**Error-Handling**
Custom Phrase-Level Recovery (Semi-Global Correction)
> * Corrects parse tree by changing incorrect tokens based on first matching grammar rules.
> * In some cases, recovery is impossible due to only focusing on first matching grammar rule.
> * Lists sub-errors that may be caused by the first syntax error found.

**Output**
1.  A [cjs.p3.txt] file containing the final compiled parse tree
2.  A [cjs.p3A.txt] file containing an array (separated by newlines) version of the parse tree.

**Notes:**
1.	'verbose' in syn.js should turn off the printing of processes
2.	Error test files are test1e.cjs, test2e.cjs, test3e.cjs
3.	No-error test files are test1.cjs, test2.cjs, test3.cjs
4.	Error files 1 and 2's parse tree can be corrected, while 3's parse tree is irrecoverable due to consecutive/intense grammatical errors.

Running the script
-------------

> **Requirements:**

> - Node.js
> - A file with correct lexemes (a ".cjs" file)

**Node.js**

To use, simply use the command below on the same directory as syn.js and <.cjs file>.
```
node syn.js <.cjs file>
```
