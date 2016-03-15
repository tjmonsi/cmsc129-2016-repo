# Ferriel's Language
===================
[0.0.1] - 13th of March, 2016

# Some Notes
------------
The grammar written below does not use epsilon
hence, it is verbose. The plus side is that it
is already written left recursively to avoid
ambiguity.

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
	e.g. a, ab, abc, A, aB, aBc, ab_c
symbol
	e.g. _ ( ) [ ] { } = ! < > * / + - % & | . , ? ;

```
**Keywords:**
```
let
fn
out
in
stdout
stdin
return
for
while
do_while
true
false
continue
break
if
else_if
else
==
!=
<=
>=
&&
||
//
/*
*/
```

#Non-Terminals
-------------
```
vardec
varname
init
array
op
cond
conj
stmt
expr
args
params
functionname
function
block
ifblock
loopblock
whileloop
dowhileloop
forloop
output
input
string
boolean
strings
booleans
numbers
obj
```

#Production Rules
--------------

|LHS | RHS|
|-----|------|
|string| "word \| symbol \| number"|
|boolean| true \| false|
|varname| word|
|init| number|
||string|
||boolean|
||functioncall|
|vardec| let varname;|
||let varname = init;|
|array| [strings]|
||[numbers]|
||[booleans]|
|strings| string|
||strings, string|
|numbers|number|
||numbers, number|
|booleans| boolean|
||booleans, boolean|
|op| \+ \| \- \| \* \| / \| % \| =|
|cond|< \| > \| <= \| => \| == \| !=|
|conj|and \| or|
|stmt| boolean \| varname |
||stmt boolean|
||stmt varname|
||stmt cond boolean|
||stmt cond varname|
||stmt conj boolean|
||stmt conj varname|
|obj| varname \| string \| boolean \| number |
|expr| obj op varname; \| expr obj op varname; |
|| obj op string; \| expr obj op string; |
|| obj op boolean; \| expr obj op boolean; |
|| obj op number; \| expr obj op number; |
|args| obj |
|| args comma obj|
|params| varname |
|| params, varname|
|functionname| word |
|functioncall| functionname(args) |
|function| functionname(params) { block } |
|block| stmt \| block stmt|
||return stmt; \| block return stmt;|
||vardec \| block varde |
||ifblock \| block ifblock |
||loopblock \| block loopblock |
||output \| block output |
||input \| block input |
|ifblock| if(stmt) { block } |
|| ifblock else if(stmt) { block } |
|| ifblock else { block } |
|loopblock| whileloop \| dowhileloop \| forloop |
|whileloop| while(stmt) { block }|
|dowhileloop| do_while(stmt) { block } |
|forloop| for(init; stmt; expr) { block }|
|output| out(obj, string); |
|input | in(varname, string); |

# Example Codes
**hello_world.fl :**
---------------------
```rust
fn main() {
    out("Hello World\n", output.txt);
}
```
**one_to_ten.fl:**
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
fn fibonacci(n) {
    if(n <= 2) {
        return 1;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}
```
