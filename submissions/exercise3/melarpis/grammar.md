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
"let", "for", "while", "do", "in",
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
IDENTIFIER
STRING
NUMBER
EXPR
STMT
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
|ARRAY_EXPR|"[" ELEMENTS "]"|
|ELEMENTS|NUMBER E_NUMBER|
||STRING E_STRING|
|E_NUMBER|"," NUMBER E_NUMBER|
||epsilon|
|E_STRING|"," STRING E_STRING|
||epsilon|
|STRING_EXPR| STRING E_STRING_EXPR|
||IDENTIFIER E_STRING_EXPR|
|E_STRING_EXPR| "+" STRING E_STRING_EXPR|
||"+" IDENTIFIER E_STRING_EXPR|
||epsilon|
|STMT|FN_STMT|
||IF_STMT|
||WHILE_STMT|
||DOWHILE_STMT|
||FOR_STMT|
||LET_STMT|
||ASSIGN_STMT|
|BLOCK| STMT BLOCK|
||epsilon|
|FN_STMT|"fn" IDENTIFIER "{" BLOCK "}"|
|IF_STMT|"if" COND "{" BLOCK "}" IF_STMT_EXT|
|IF_STMT_EXT|"else if" COND "{" BLOCK "}" IF_STMT_EXT|
||"else" "{" BLOCK "}"|
|WHILE_STMT|"while" COND "{" BLOCK "}"|
|DOWHILE_STMT|"do" "{" BLOCK "}" "while" COND|
|FOR_STMT|"for" IDENTIFIER "in" RANGE "{" BLOCK "}"|
|RANGE|BEGIN ".." END|
|BEGIN|IDENTIFIER|
||NUMBER|
|END|IDENTIFIER|
||NUMBER|
|COND| BOOL_EXPR COND_EXT|
||"not" COND|
|COND_EXT| COND_OP BOOL_EXPR|
|COND_OP|and|
||or|

# Example Codes
**1.fl :**
--------------------
```rust
fn main() {
    out("Hello World\n");
}
```

**2.fl :**
--------------------
```rust
fn main() {
    let n;
    in(n);
    if (n == 0) {
      out("0\n");
    } else if (n > 0) {
      for i in 1..(n + 1) {
        out(i + "\n");
      }
    } else {
      for i in -1..(n - 1) {
        out(i + "\n");
      }
    }
}
```
**3.fl :**
--------------------
```rust
fn main() {
  let n;
	let numbers = [];
	let i = 0;
	while in("test.txt", n) {
		numbers[i] = n;
		i = i + 1;
	}
	for x in 0..i {
		let xxs = x + 1;
		let min = numbers[x];
		for xx in xxs..i {
			if numbers[xx]<min {
				let temp = numbers[x];
				numbers[x] = numbers[xx];
				numbers[xx] = temp;
			}
		}
	}
	for x in 0..i {
		out("output.txt", numbers[x]);
	}
}
```
**4.fl :**
--------------------
```rust
fn main() {
	let x;
	in(x);
	let p1 = 1;
	let p2 = 1;
	out(p1 + " ");
	out(p2 + " ");
	for i in 2..x {
		let next = p1 + p2;
		out(next + " ");
		p1 = p2;
		p2 = next;
	}
}
```
