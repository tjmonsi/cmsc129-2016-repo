# F Language
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
alnum {alpha + {alpha U digit}}
whitespace {' ','\t','\n','\r'}
boolean {true, false}
```

**Keywords:**
```rust
"let", "for", "while", "do",
"continue", "break", "fn", "return",
"if", "else if", "else",
"true", "false", "and", "or", "not"
```

**Symbols**
```rust
">", ">=", "<", "<=", "==", "!=", "..",
"+", "-", "*", "/", "%", "=", ",", ";",
"{", "}", "(", ")", "[", "]", "/*", "*/", "//"
```

**Whitespaces**
```rust
"\r", "\t", "\n", " "
```

#Non-Terminals
-------------
```
```

#Production Rules
--------------

|LHS | RHS|
|-----|------|
|IDENTIFIER|alnum|
|STRING|'"' {digit U alpha U whitespace}  '"'|
|NUMBER|digit NUMBER|
||"." DECIMAL|
||epsilon|
|DECIMAL|digit DECIMAL|
||epsilon|
|EXPR|BOOL_EXPR|
||ARITH_EXPR|
||FN_EXPR|
||ARRAY_EXPR|
||STRING_EXPR|
|BOOL_EXPR|IDENTIFIER BOOL_EXPR_EXT|
||boolean BOOL_EXPR_EXT|
||FN_EXPR BOOL_EXPR_EXT|
|BOOL_EXPR_EXT|BOOL_OP IDENTIFIER BOOL_EXPR_EXT|
||BOOL_OP boolean BOOL_EXPR_EXT|
||BOOL_OP FN_EXPR BOOL_EXPR_EXT|
||epsilon|
|BOOL_OP|and|
||or|
||not|
|ARITH_EXPR|IDENTIFIER ARITH_EXPR_EXT|
||NUMBER ARITH_EXPR_EXT|
||FN_EXPR ARITH_EXPR_EXT|
|ARITH_EXPR_EXT|ARITH_OP IDENTIFIER ARITH_EXPR_EXT|
||ARITH_OP NUMBER ARITH_EXPR_EXT|
||ARITH_OP FN_EXPR ARITH_EXPR_EXT|
||epsilon|
|ARITH_OP|+|
||-|
||*|
||/|
||%|
|FN_EXPR|IDENTIFIER "(" PARAMS ")"|
|PARAMS|IDENTIFIER PARAMS_EXT|
|PARAMS_EXT|"," IDENTIFIER|
||epsilon|


# Example Codes
**1.fl :**
--------------------
```rust
fn main() {
    print("Hello World\n");
}
```

**2.fl :**
--------------------
```rust
fn main() {
    let n;
    scan(n);
    if (n == 0) {
      print("0\n");
    } else if (n > 0) {
      for i in 1..(n + 1) {
        print(i + "\n");
      }
    } else {
      for i in -1..(n - 1) {
        print(i + "\n");
      }
    }
}
```
**3.fl :**
--------------------
```rust
fn main() {
    print("Hello World\n");
}
```
**4.fl :**
--------------------
```rust
fn main() {
    print("Hello World\n");
}
```
**5.fl :**
--------------------
```rust
fn main() {
    print("Hello World\n");
}
```
**6.fl :**
--------------------
```rust
fn main() {
    print("Hello World\n");
}
```
**7.fl :**
--------------------
```rust
fn main() {
    print("Hello World\n");
}
```
**8.fl :**
--------------------
```rust
fn main() {
    print("Hello World\n");
}
```
