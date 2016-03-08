# Exercise 3 - Create a Lexical Analyzer Part 2 + Syntax Analyzer Part 1

Syntax Analysis is the part where the program takes in the lexemes from your Lexical Analyzer and parse them to do the following:

- Check for syntax errors
- Report if there's any syntax errors
- Create a parse tree for semantic analysis or intermediate code generation

In essence, Syntax analysis is the problem of taking a string of terminals and figuring out how to derive it from the start symbol of the grammar, and if it cannot be derived from the start symbol of the grammar, then reporting syntax errors within the string. 

Here are the things that you need to know about creation of a Syntax Analyzer

1. Syntax Error Handling
2. Elimination of Ambiguous Grammar
3. Elimination of Left-Recursion
4. Left Factoring
5. Top-down Parsing
6. Recursive Descent Parsing

## Syntax Error Handling

Syntax Errors should be handled in such a way that the parser can recover from a syntax error to find more syntax errors, or be fast enough to determine that it is a constructable parse tree with minimum time and resources.

There are 4 ways to do this:

### Panic-Mode Recovery 

On error, parser skips tokens from lexemes until a synchronizing token is found.

Synchronizing tokens can be delimeters (`;`, `\n`, `}`), depending on the compiler designer, and usually unambiguous (doesn't have any other meaning but to terminate a line, a code-block, function, object, etc...)

It is considered simple and is not prone to have an infinite loop, but can miss other errors skipped.

### Phrase-Level Recovery 

On error, parser may correct the token that contains the error. A correction may be some form of the following:

- replace a comma, dot, or colon to semicolon
- delete extra semicolon
- insert missing semicolon

It is prone to have infinite loops if the designer is not careful.

### Error Productions

Anticipate errors by making a different grammar rules that produces erroneous syntax. If the constructed tree is of an error tree, then the syntax is erroneous.

### Global Correction 

The ideal compiler only makes a few changes to the incorrect input lexemes to create a correct parse tree. Algorithms already exists in finding a parse tree for a given a grammar rule and an array of lexemes with some incorrect tokens. 

Problem with this idea is that too costly to implement and too theoretical as of the moment.

-------------------------

Because of the complexity of the 4th, and the added work needed to do the 3rd, you only need to do one of the first two to recover from an error from a syntactically erroneous code.

One goal of the exercise is:

- Create 3 example codes using your language with at least 5 syntax errors;
- All syntax errors must be reported by your syntax analyzer
- Create the same 3 example codes without syntax errors;
- It should show the parse tree (in tree form on .txt file)
- It should show the array representation of the parse tree (in .txt file)
- Input of parse tree should come from tweaked code from exercise2

-------------------------

## Other tips

### Elimination of Ambigious Grammar

Ambiguous grammar are grammar that can create two parse tree representation of a certain set of lexemes. Consider this example:

```
if E1 then if E2 then S1 else S2
```

Given this grammar rule:

```
stmt -> if expr then stmt
     -> if expr then stmt else stmt
     -> ...
```

can create these parse trees

```
stmt
 |-----------
 |  |  |    |
if  E1 then stmt
    --------|--------------
    |   |   |     |  |    |
    if  E2  then  S1 else S2
```

```
stmt
 |---------------------
 |  |  |    |    |    |
if  E1 then stmt else S2
    --------|------
    |   |   |     |  
    if  E2  then  S1 
```

In essence, by adding 'grouping', we can see either:

```
(if E1 then (if E2 then S1 else S2))
```
or
```
(if E1 then (if E2 then S1) else S2)
```

To eliminate them, we can rewrite the ruling as this:

```
stmt         -> matched_stmt
             -> open_stmt
matched_stmt -> if expr then matched_stmt else matched_stmt
             -> ...
open_stmt    -> if expr then stmt
             -> if expr then matched_stmt else open_stmt
```

The idea of the new rule is to still accept the given string above, but it creates only one parse tree that tries to match the `else` keyword to be paired with the closest `then` keyword. Thus, creating this...

```
stmt
 |
open_stmt
 |-----------
 |  |  |    |
 if E1 then stmt
            |
        matched_stmt
    --------|---------
    |  |    |  |     |
    if E2  S1  else  S2
```

There's no hard and fast rule on eliminating ambiguous grammar or checking if a grammar is ambiguous (it is an NP-hard problem).

### Elimination of Left Recursion 

Left-recursive grammars are grammars with this production:

```
A -> Ax // where x is a string of terminal or non-terminal characters
```

Top-down parsing methods cannot handle left-recursive grammars, so a transformation is needed to eliminate left recursion.

Consider this:

```
A -> Aa | B
// given B is a string of terminal or non-terminal characters that doesn't start with A (i.e: e or null string)
```

We can transform it to this:

```
A -> BA'
A' -> aA' | e
```

Thus in our example above, we can do this:

```
A -> Ax (which is actually A -> Ax | e)
// transforms to...
A -> A' (which is actually A -> eA')
A' -> xA' | e
```

The general rule in eliminating left recursion is this 4 points in a given Grammar production rule set:

1. Sort non-terminals in order
2. For each non-terminal production, substitute the non-terminals in the production from the previous finished non-terminal, and put it in the production list
3. Remove immediate left-recursion
4. Move to next non-terminal production, Repeat 2 and 3.

To practice, given this:

```
S -> Aa | b 
A -> Ac | Sd | e
```

- Sort non-terminals in order

We order them like this...

```
S, A
```

- For each non-terminal production, substitute the non-terminals in the production from the previous finished non-terminal, and put it in the production list

Because `S` is the first non-terminal in the list, we can't substitute the non-terminal `A` in `S -> Aa` because we haven't reached `A` yet.

- Remove immediate left-recursion

There's no immediate left-recursion in `S`

- Move to next non-terminal production and Repeat 2 and 3

```
A
```

- For each non-terminal production, substitute the non-terminals in the production from the previous finished non-terminal, and put it in the production list

```
A -> Ac | Sd | e 
```

becomes...

```
A -> Ac | Aad | bd | e
```

where `Aad` and `bd` where derive by substituting `S` to `Aa` and `b` from the finished processed production `S -> Aa | b`

- Remove immediate left-recursion

Because we have 2 left-recursion production `A -> Ac` and `A -> Aad` we derive this:

```
A -> Ac | bd | e
A -> Aad | bd | e
```

we create these:

```
A -> bdA' | eA'
A' -> cA' | e 

A -> bdA' | eA'
A' -> adA' | e
```

We can then combine them to become...

```
A -> bdA' | eA'
A' -> adA' | cA' | e
```

Thus, the resulting new production list with left-recursion eliminated is:

```
S -> Aa | b
A -> bdA' | eA'
A' -> adA' | cA' | e
```
