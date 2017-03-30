Grammar
===================
[Revision 1] - 6th of March, 2016
[Revision 2] - 12th of March, 2016
[Revision 3] - 4th of April, 2016

Revision 3 Notes:
	Converted to left-factored grammar

----------


Terminals
-------------
```
//Variables:
epsilon

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
Start	
Main	
newline	
Fn-def	
Fn-Param	Fn-Param'	Fn-Param''
Code-Block	
Statement	
Var-dec		Var-dec'	Var-dec''			
Asg-Exp		Asg-Exp'
print-Call
load-Call
Fn-Call		Fn-call
Wh-loop
For-loop
Do-loop
If			If'
Else
Expression
ID-Exp
Num-Exp
Math-Exp
Term		Term'
Factor		Factor'
Bool
Number
Return
```

Production Rules
--------------
> *Notes:*
>  E = epsilon;
>  /V/ refers to a variable listed above

|/LHS/ | RHS|
|-----|------|
|Start|/Main/|
|Main|/func-def/ /Main/|
||epsilon|
|Main'|/newline/ /Main/|
||epsilon|
|newline|\\n /newline/|
|newline|epsilon|
|Code-Block|/Statement/ /Code-Block/|
||/newline/ /Code-Block/|
||/Return/ ;|
||epsilon|
|Statement|/Var-dec/ ;|
||/Asg-Exp/ ;|
||/print-call/ ;|
||/load-call/ ;|
||/Wh-loop/|
||/For-loop/|
||/Do-loop/ ;|
||/If/|
|Var-dec|var /Var-dec'/|
|Var-dec'|identifier /Var-dec''/|
|Var-dec''|epsilon|
||= /Expression/|
|Fn-def|function identifier ( /Fn-Param/ ) { /Code-Block/ }|
|Fn-Param|/Expression/ /Fn-Param'/|
||epsilon|
|Fn-Param'|, /Fn-Param''/|
||epsilon|
|Fn-Param''|/Expression/, /Fn-Param/|
|Asg-Exp|identifier /Asg-Exp'/|
|Asg-Exp'|= /Expression/|
||/Fn-Call'/|
|print-call|print /Fn-call'/|
|load-call|load /Fn-call'/|
|Fn-call|identifier /Fn-call'/|
|Fn-call'|( /Fn-Param/ )|
|Wh-loop|while ( /Expression/ ) { /Code-Block/ }|
|For-loop|for ( /Statement/ ; /Expression/ ; /Expression/ ) { /Code-Block/ }|
|Do-loop|do { /Code-Block/ } while ( /Expression/ )|
|If|if ( /Expression/ ) { Code-Block }|
|If'|/newline/ else /Else/|
||else /Else/|
|Else|epsilon|
||{ /Code-Block/ }|
|Math-Exp|/Term/ /Math-Exp'/|
|Math-Exp'|\+ /Math-Exp/|
||\- /Math-Exp/|
||epsilon|
|Term|/Factor/ /Term'/|
|Term'|% /Term'/|
||\* /Term'/|
||/ /Term'/|
||epsilon|
|Factor|identifier /ID-Exp/|
||Number|
||( /Math-Exp/ )|
|Bool|< /Expression/|
||\> /Expression/|
||<= /Expression/|
||\>= /Expression/|
||== /Expression/|
||!= /Expression/|
|Array|[ /Expression/ ] /Array'/|
||epsilon|
|Expression|( /Expression/ )|
||/load-call/|
||identifier /ID-Exp/|
||string /Num-Exp/|
||Number /Num-Exp/|
|ID-Exp|/Array/ /Num-Exp/|
||/Fn-call/ /Num-Exp/|
||/Num-Exp/|
||epsilon|
|Num-Exp|Bool|
||Math-Exp|
||Term|
||epsilon|
|Number|number|
||\- number|
|Return|return /Expression/|