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
**Values:**
```
digit {0 - 9}
alpha {a - z} U {A - Z} U {_}
```

**Keywords:**
```
"let", "for", "while", "do", "true", "false", "fn",
"if", "else if", "else", "continue", "break", "return",
">", ">=", "<", "<=", "==", "!=",
"+", "-", "*", "/", "%", "=", ", ", ";",
"{", "}", "(", ")", "[", "]", "\n",
"&&", "||", "!", "/*", "*/", "//"
```

#Non-Terminals
-------------
```
<varname>
<expr>
<stmt>
```

#Production Rules
--------------

|LHS | RHS|
|-----|------|
|<id>|alpha <v>|
|<v>|alpha <v>|
||digit <v>|
||epsilon|
|-----|------|
|<expr>|<id> +

# Example Codes
**hello_world.fl :**
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
		for i in 1..10 {
        out(i, output.txt);
    }
}
```
**fibonacci.fl:**
---------------------
```rust
fn fibonacci(n) {
    if n <= 2 {
        return 1;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}
fn main() {
	out(fibonacci(5), stdout);
}
```
