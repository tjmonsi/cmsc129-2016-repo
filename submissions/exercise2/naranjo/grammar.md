#Terminal List

Data Types/Literals
```
<number>
<string>
```

Keywords
```
instance
write
or
and
yes
so
noso
around
lengthof
stop
send
function
ask
start
end
runon
runfirst
(For conditional statements)
lt, gt, equ, gte, lte, nequ
(For arithmetic operations)
ad, sb, ml, dv, md, ==
```

Symbols
```
" ( ) : ; , { } \t \n
```

#Non-Terminal List
```
<VARDEC>
<VARNAME>
<EQD>
<VALUE>
<EQU>
<ARE>
<OP>
<COMPARE>
<COMPARISON>
<OUTPUT>
<STRINGLENGTH>
<CONDITIONAL>
<FUNCTIONCALL>
<INCREMENT>
<DECREMENT>
<ARGLIST>
<FUNCTION>
<RETURN>
<PROGRAMSTART>
<PROGRAMEND>
<USERINPUT>
<BREAK>
<EXPR>
```

#Production List
```
<VARDEC> := instance <VARNAME>; |
			instance <EQD>;
<VARNAME> := <string> | <string> [<number>] <EXPR>
<EXPR> := <VARDEC|EQU|OUTPUT|CONDITIONAL|INPUT>|<EXPR><EXPR>|<BREAK>|<RETURN>|<USERINPUT>
<VALUE> := <number>|"<string>"|<STRINGLENGTH>|<FUNCTIONCALL>
<EQU> := <EQD>|<VARNAME> == <ARE>;|<VARNAME> == <FUNCTIONCALL>;
<ARE> := <VALUE|VARNAME>, <VALUE|VARNAME>: <OP>; | <ARE>, <VALUE|VARNAME>: <OP>;
<OP> := ad|sb|ml|dv|md
<BREAK> := stop;
<COMPARE> := <COMPARE|EXPR|VARNAME|VALUE> <lt|gt|equ|gte|lte|nequ> <EXPR|VARNAME|VALUE|COMPARE>
<COMPARISON> := <COMPARE> <or|and> <COMPARE> | <COMPARISON> <or|and> <COMPARE> 
<OUTPUT> := write <VALUE>; | write <VARNAME>;
<STRINGLENGTH> := lengthof (<VARNAME>)
<INCREMENT> := <VARNAME>: ad
<DECREMENT> := <VARNAME>: sb
<CONDITIONAL> := yes(<COMPARE>) so{
					 <EXPR>
				 }noso{
					 <EXPR>
				 }
				 |
				 yes(<COMPARE>) so{
					 <EXPR>
				 }
				 |
				 around(<EQU>;<COMPARE>;<INCREMENT|DECREMENT>){<EXPR>} |
				 runon(<COMPARE>){<EXPR>} |
				 runfirst{<EXPR>}runon(<COMPARE>);
<USERINPUT> := ask <VARNAME>;
<FUNCTIONCALL> := <string> (<ARGLIST>);
<ARGLIST> := <VARNAME> | <VARNAME>, <ARGLIST>
<FUNCTION> := function <string>(<ARGLIST>){<EXPR>}
<RETURN> := send <VARNAME|VALUE>;
<PROGRAMSTART> := start:
<PROGRAMEND> := end: