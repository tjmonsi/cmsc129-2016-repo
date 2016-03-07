Production List:

ALPHA -> A-Z|a-z
NUMERIC -> 0-9
SPACE -> (SPACE CHARACTER)
OPEN_PAREN -> (
CLOSE_PAREN -> )
QUOT -> "
BOOL_OPT -> true | False
DATATYPE -> int | dbl | str | bool
==========================================================
INTEGER -> NUMERIC INTEGER | NUMERIC
DOUBLE -> NUMBER.NUMBER
NUMBER -> INTEGER | DOUBLE
WORD -> ALPHA | NUMERIC | WORD 
=======================================================
MATH_OPERATION -> + | - | * | /
COMPARISON_OPERATION -> == | < | > | <= | >= | !=
UNARY_MATH_OPERATION -> ++ | -- | += | -= | =- | =+
LOGIC_OPERATION -> or | and 
NOT_OPERATION -> not
=========================================================
VARNAME -> ALPHA WORD
=====================================================
STRING -> QUOT SENTENCE QUOT
SENTENCE -> WORD SPACE SENTENCE | WORD SPACE
=====================================================
MATH_EXPR -> NUMBER MATH_OPERATION NUMBER MATH_EXPR_ALPHA | NUMBER OPERATION NUMBER | NUMBER OPERATION VARNAME | VARNAME OPERATION VARNAME | 
	VARNAME OPERATION NUMBER | OPEN_PAREN MATH_EXPR CLOSE_PAREN
MATH_EXPR_ALPHA -> MATH_OPERATION NUMBER | MATH_OPERATION VARNAME
==============================================================
EQUATION -> = MATH_EXPR | = STRING | = NUMBER | = VARNAME 
VARDEC -> declr DATATYPE VARNAME | declr DATATYPE VARNAME EQUATION
ASSIGNMENT -> VARDEC EQUATION
===================================================================
INPUT -> get VARDEC
OUTPUT -> print VARNAME | print STRING | print MATH_EXPR
==================================================================
COMP_EXPR -> OPEN_PAREN COMP_EXPR CLOSE_PAREN | MATH_EXPR COMPARISION_OPERATION MATH_EXPR | VARNAME COMPARISON_OPERATION VARNAME | MATH_EXPR 
	COMPARISON_OPERATION VARNAME | VARNAME COMPARISION_OPERATION MATH_EXPR
==================================================================
LOGIC_ARGS -> VARNAME | COMP_EXPR | BOOL_OPT
LOGIC_EXPR -> LOGIC_OPERATION LOGIC_ARGS LOGIC_ARGS
=================================================================
COMPARATORS -> COMP_EXPR | LOGIC_EXPR | BOOL_OPT | VARNAME
IF_ELSE -> if OPEN_PAREN COMPARATORS CLOSE_PAREN { EXPRESSIONS } else { EXPRESSIONS }
WHILE_LOOP -> while OPEN_PAREN COMPARATORS CLOSE_PAREN { EXPRESSIONS } 
FOR_LOOP -> for (ASSIGNMENT DELIM  COMPARATORS DELIM  EXPR) { EXPRESSION } 
===============================================================
DELIM -> ;
EXPR -> VARDEC | ASSIGNMENT | INPUT | OUTPUT | MATH_EXPR | LOGIC_EXPR | COMP_EXPR | IF_ELSE | WHILE_LOOP | FOR_LOOP
EXPRESSION ->  EXPRESSION DELIM | EXPRESSION DELIM EXPRESSION
================================================================
FUNCTION_ARGS -> DATATYPE VARNAME ,|DATATYPE VARNAME | ARGUMENTS | e
FUNCTION -> function VARNAME OPEN_PARAM ARGUMENTS CLOSE_PARAM { EXPRESSION }
================================================================
S -> FUNCTION | S

