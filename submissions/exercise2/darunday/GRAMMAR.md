# Grammar Specification for the RIVER Programming Language

This is the grammar specification for implementing an automata-based compiler for the RIVER Programming Language.

## Terminal
The following is the list of terminal keywords.
```
let
fn
do
while
for
in
loop
String
Boolean
Decimal
read
write
print
return
continue break
true false
> < >= <= ==
+ - / *
= ->
{} () [] : .. ;
```

## Non-Terminal
The following is a list of non-terminal variables.
```
DELIM
EXPRESSION
DECIMAL
STRING
RANGE
VARNAME
TYPE
BOOL
ARIT
FNPARAMS
FUNC
RANGE
FOR
DOWHILE
WHILE
LOOP
ELSEIF
IF
VARDEC
```

## Production Rules
The following are the production rules.

|  Variable  | Rule                                                         |
|------------|--------------------------------------------------------------|
| DELIM      | semicolon \| newline |
| MULTIEXPR  | MULTIEXPR DELIM EXPRESSION |
| EXPRESSION | DECIMAL \| STRING \| VARNAME \| BOOLEXPR \| ARITEXPR \| VARDEC \| FOR \| WHILE \| DOWHILE \| LOOP \| {MULTIEXPR} |
| DECIMAL    | [0-9]+(\.[0-9]+)?
| STRING     | \"\([character]\|${VARNAME}\|\\\"\|\uFFFF\|/escape\)\*\" |
| RANGE      | DECIMAL..DECIMAL \| DECIMAL..DECIMAL..DECIMAL |
| VARNAME    | [a-zA-Z$@][a-zA-Z0-9$@]+ |
| TYPE       | String \| Decimal \| Boolean |
| BOOL       | BOOL && BOOL \| BOOL \|\| BOOL \| BOOL ^^ BOOL \| !BOOL \| (BOOL) \| true \| false |
| ARIT       | ARIT * ARIT \| ARIT + ARIT \| ARIT / ARIT \| ARIT - ARIT \| (ARIT) \| DECIMAL |
| FNPARAMS   | VARNAME: TYPE \| VARNAME: TYPE, FNPARAMS |
| FUNC       | fn VARNAME(FNPARAMS) -> TYPE EXPRESSION ε \| fn VARNAME(FNPARAMS) EXPRESSION ε |
| FOR        | for VARNAME in RANGE EXPRESSION |
| DOWHILE    | do EXPRESSION while(BOOL) |
| WHILE      | while(BOOL) EXPRESSION |
| LOOP       | loop EXPRESSION |
| ELSEIF     | elseif BOOL EXPRESSION \| elseif EXPRESSION else EXPRESSION |
| IF         | if EXPRESSION \| if EXPRESSION else EXPRESSION \| if EXPRESSION ELSEIF else EXPRESSION |
| VARDEC     | let VARNAME: TYPE = EXPRESSION \| let VARNAME = EXPRESSION |



## Sample Code

``` rust
fn main(){
	print("hello world");
}
```

``` rust
fn main(){
	let arr: Decimal = [10];
	for i in 1..10 print(arr[i-1]);
}
```

``` rust
fn fib(n) -> Decimal: if(n<=2) 1 else fib(n-1) + fib(n-2)
fn main(): print(fib(10));
```
