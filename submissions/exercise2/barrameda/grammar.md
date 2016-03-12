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

