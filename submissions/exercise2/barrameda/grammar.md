#Terminals

Keywords
```
new
print
scan
concat
splice
len
func
return
call
if
elsif
else
for
while
do
not
and
or
true
false
_i
```

Symbols
```
( ) { } [ ] = + - / * % < > == <= >= // /* */
```

Data Types
```
<string>:= $
<integer>:= !
<float>:= @
<boolean>:= ~
```

Literals
```
<numbers>:= (-)?([0-9])*(\.)?([0-9])+
<strings>:= "[a-zA-Z0-9\s\.]*"
``` 
	
#Non Terminals
```
<assign>:= <varident><eq><expression>
<varident>:= <dataTypes>[a-zA-Z][a-zA-Z0-9]*
<dataTypes>:= (<string>|<integer>|<float>|<boolean>)
<expression>:= (<arithOp>|<booleanOp>|<stringOp>|<Literals>)
<arithOp>:= (<multiply>|<divide>|<modulo>|<add>|<subtract>)
<booleanOp>:= (<and>|<or>|<lessThan>|<greaterThan>|<equal>|<lessOrEqual>|<greaterOrEqual>)
<stringOp>:= (<concat>|<substring>|<length>)
<operand>:= (<varident>|<expression>)
<codeblock>:= (<expression>|<expression><codeblock>)
```
	
#Production List
```
<vardec>:= new <varident>
	:= new <assign>
<arrayDec>:= new <varident>[<numbers>]

<output>:= print(<expression>)
<input>:= scan(<varident>, <strings>)

<multiply>:= <operand><symbol><operand>
<divide>:= <operand><symbol><operand>
<modulo>:= <operand><symbol><operand>
<add>:= <operand><symbol><operand>
<subtract>:= <operand><symbol><operand>

<and>:= <operand><symbol><operand>
<or>:= <operand><symbol><operand>
<lessThan>:= <operand><symbol><operand>
<greaterThan>:= <operand><symbol><operand>
<equal>:= <operand><symbol><operand>
<lessOrEqual>:= <operand><symbol><operand>
<greaterOrEqual>:= <operand><symbol><operand>

<substring>:= splice((<strings>|<varident>), <numbers>, <numbers>)
<concat>:= concat(<operand>, <operand>)
<length>:= len(<strings>|<operand>)

<functionDec>:= func <varident>(E|<varident>) {<codeblock> return}
<functionCall>:= call <varident>(E|<varident>|<expression>)

<if-then>:= 	if(<booleanOp>) {<codeblock>}
		elsif(<booleanOp>) {<codeblock>}
		else {<codeblock>}
		
<for-loop>:= for(<assign>; <booleanOp>; <assign>) {<codeblock>}
<while-loop>:= while(<booleanOp>) {<codeblock>}
<do-while-loop>:= do{<codeblock>} while(<booleanOp) 
```
