# Ferriel's Language
===================
[0.0.1] - 13th of March, 2016

> [Issues]
> Possible Ambiguities	


----------

##Terminals
-------------
```
*Variables:*
number 
	e.g. 123, .123, 1.23
word
	e.g. a, ab, abc, A, aB, aBc, ab_c
symbol 
	e.g. _ ( ) [ ] { } = ! < > * / + - % & | . , ? ;

*Keywords:*
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

##Non-Terminals
-------------
```
vardec
varname
init
array
operator
cond
conj
obj
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
```

##Production Rules
--------------
> _Note: e = epsilon_;

|LHS | RHS|
|-----|------|
|string =>|"word\|symbol\|number"|
|boolean =>|true\|false|
|varname =>|word|
|init =>|number|
|=>|string|
|=>|boolean|
|=>|functioncall|
|vardec =>|let varname;|
|=>|let varname = init;|
|array =>|[strings]|
|=>|[numbers]|
|=>|[booleans]|
|strings =>|strings,string|
|=>|e|
|numbers =>|numbers, number|
|=>|e|
|booleans =>|booleans. boolean|
|=>|e|
|operator =>|\+\|\-\|\*\|\/\|%\|=|
|||
