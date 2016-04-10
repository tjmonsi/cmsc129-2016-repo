# Ferriel's Language
===================
[0.0.1] - 13th of March, 2016

# Contents
- [Terminals](#terminals)
- [Non-Terminals](#non-terminals)
- [Production Rules](#production-rules)
- [Example Codes](#example-codes)

----------

#Terminals
-------------
**Variables:**
```
number
	e.g. 123, .123, 1.23
word
	e.g. a, ab, abc, A, aB, aBc

```
**Keywords:**
```
let fn out in stdout stdin return
for while do_while true false
continue break if else_if else
== != <= >= && \|\| // /\* \*/ !
= - / % () [ ] { }
```

#Non-Terminals
-------------
```
```

#Production Rules
--------------

|LHS | RHS|
|-----|------|
|<program>|<fndef> <main>|
|<fndef>|'fn' <ident> '(' <params> ')' '{' <block> '}' <fndef>|
||epsilon|
|<main>|'fn' 'main' '(' ')' '{' <block> '}'|

# Example Codes
**hello\_world.fl :**
---------------------
```rust
fn main() {
    out("Hello World\n", output.txt);
}
```
**one\_to\_ten.fl:**
---------------------
```rust
fn main() {
    for(let i = 1; i <= 10; i++) {
        out(i, output.txt);
    }
}
```
**fibonacci.fl:**
---------------------
```rust
fn main() {
	let first = 1, second = 1;
	let n;
	in(n, stdin);
	let i;
	for (i = 2; i <= n; i++) {
		let temp = second;
		second = first + second;
		first = temp;
	}
	out(second, stdout);
}
```
