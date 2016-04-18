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
( ) { } [ ] = + - / * % < > == <= >= // /* */ ;
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
<dataTypes>:= (<string>|<integer>|<float>|<boolean>)
<statement>:= (<expression>|<vardec>|<arrayDec>|<assign>|<if-then>|<for-loop>|<while-loop>|<do-while-loop>|<functionDec>|<functionCall>|<output>|<input>)
<expression>:= (<arithOp>|<booleanOp>|<stringOp>|<Literals>)
<arithOp>:= (<multiply>|<divide>|<modulo>|<add>|<subtract>)
<booleanOp>:= (<and>|<or>|<lessThan>|<greaterThan>|<equal>|<lessOrEqual>|<greaterOrEqual>)
<stringOp>:= (<concat>|<substring>|<length>)
<operand>:= (<varident>|<expression>)
<codeblock>:= (<statement>|<statement><codeblock>)
```

#Production List
```
<assign>:= <varident><eq><expression><line-delimiter>
<varident>:= <dataTypes>[a-zA-Z][a-zA-Z0-9]*<line-delimiter>
<vardec>:= new <varident><line-delimiter>
	:= new <assign><line-delimiter>
<arrayDec>:= new <varident>[<numbers>]<line-delimiter>

<output>:= print(<statement>)<line-delimiter>
<input>:= scan(<varident>, <strings>)<line-delimiter>

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

<substring>:= splice((<strings>|<varident>), <numbers>, <numbers>)<line-delimiter>
<concat>:= concat(<operand>, <operand>)<line-delimiter>
<length>:= len(<strings>|<operand>)<line-delimiter>

<functionDec>:= func <varident>(E|<varident>) {<codeblock> return}
<functionCall>:= call <varident>(E|<varident>|<statement>)

<if-then>:= 	if(<booleanOp>) {<codeblock>}
		elsif(<booleanOp>) {<codeblock>}
		else {<codeblock>}

<for-loop>:= for(<assign>; <booleanOp>; <assign>) {<codeblock>}
<while-loop>:= while(<booleanOp>) {<codeblock>}
<do-while-loop>:= do{<codeblock>} while(<booleanOp)
```
