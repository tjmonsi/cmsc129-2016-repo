Grammar
===================
[Revision 1] - 6th of March, 2016

> [Issues]
> Ambiguity	


----------

Terminals
-------------
```
//Variables:
number 
	e.g. 123, .123, 1.23
word
	e.g. a,ab,abc,A,aB,aBc
symbol 
	e.g. ( ) [ ] { } = ! < > * / + - % & | . ? ;
	(note: Symbols have their own accept states in lexical analysis)

//Keywords:
var
function
print
return
for
do
while
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

Non-Terminals
-------------
```
//Variables:
code			loop			operator
funcdef			load			operand
statement		conditional		string
func-call		if				variables
return			else			array
expression		action			value
var-dec			arithmetic		alphanum
var-array		bool-op			
```

Production Rules
--------------
> *Notes:*
>  E = epsilon;
>  /V/ refers to a variable listed above

|/LHS/ | RHS|
|-----|------|
|code|E|
||/func-def/|
|func-def|function /variable/(/func-param/){/statement/}/code/
|func-param|E
||/variable/
||/variable/,/func-param/
|statement|E
||/print/;/statement/
||/vardec/;/statement/
||/expression/;/statement/
||/func-call/;/statement/
||/load/;/statement/
||/conditional/;/statement/
||/loop//statement/
||/return//delim/
|print|print(/action/)
|var-dec|var /variable/
||var /expression/
|load|load(/string/)
|return|return(/action/)
|conditional|/if/
||/if-else/
|if|if(/boolean/){/statement/}
|if-else|/if/ else /if-else/
||/statement/
|loop|while(/boolean/){/statement/}
||do{/statement/}while(/boolean/);
||for(/var-dec/;/boolean/;/expression/){/statement/}
||for(/expression/;/boolean/;/expression/{/statement/}
|expression|/variable/=/action/
|action|/func-call/
||/arithmetic/
||/boolean/
||/variable/
||/value/
|arithmetic|/action//operator//operand/
|operator|*
||/
||+
||-
||%
|func-call|/variable/(/func-call-param/)
|func-call-param|E
||/action/
||/action/,/func-call-param/
|boolean|/action//bool-op//action/
||!/boolean/
||/action/
|bool-op|<
||>
||==
||!=
||<
||">="	//note: remove "", because MD translates >
|variable|/word//alphanum/
||/word//alphanum//array/
|array|[/action/]/array/
||E
|alphanum|E
||/number//alphanum/
||/character//alphanum/
|/string/|"/alphanum/"
|value|/string/
||/number/
||true
||false