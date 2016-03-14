Production List:

ALPHA -> A-Z|a-z
ALPHA_UPCASE -> A-Z
NUMERIC -> 0-9
SPACE -> (SPACE CHARACTER)
OPEN_PAREN -> (
CLOSE_PAREN -> )
QUOT -> "
BOOL_OPT -> true | false
DATATYPE -> int | dbl | str | bool
==========================================================
INTEGER -> NUMERIC INTEGER | NUMERIC | NEGATIVE_SYMBOL NUMERIC | NEGATIVE_SYMBOL NUMERIC INTEGER
DOUBLE -> INTEGER.INTEGER
NUMBER -> INTEGER | DOUBLE
WORD -> ALPHA | NUMERIC | WORD 
=======================================================
MATH_OPERATION -> + | - | * | /
COMPARISON_OPERATION -> == | < | > | <= | >= | !=
LOGIC_OPERATION -> or | and 
NOT_OPERATION -> not
NEGATIVE_SYMBOL -> -
=========================================================
IDENTIFIER -> ALPHA_UPCASE WORD
=====================================================
STRING -> QUOT SENTENCE QUOT
SENTENCE -> WORD SPACE SENTENCE | WORD SPACE
=====================================================
MATH_EXPR -> NUMBER MATH_OPERATION NUMBER MATH_EXPR_ALPHA | NUMBER OPERATION NUMBER | NUMBER OPERATION IDENTIFIER | IDENTIFIER OPERATION IDENTIFIER | 
	IDENTIFIER OPERATION NUMBER | OPEN_PAREN MATH_EXPR CLOSE_PAREN
MATH_EXPR_ALPHA -> MATH_OPERATION NUMBER | MATH_OPERATION IDENTIFIER
==============================================================
EQUATION -> = MATH_EXPR | = STRING | = NUMBER | = IDENTIFIER 
VARDEC -> declr DATATYPE IDENTIFIER | declr DATATYPE IDENTIFIER EQUATION
ASSIGNMENT -> VARDEC EQUATION
===================================================================
INPUT -> get VARDEC
OUTPUT -> print IDENTIFIER | print STRING | print MATH_EXPR
==================================================================
COMP_EXPR -> OPEN_PAREN COMP_EXPR CLOSE_PAREN | MATH_EXPR COMPARISION_OPERATION MATH_EXPR | IDENTIFIER COMPARISON_OPERATION IDENTIFIER | MATH_EXPR COMPARISON_OPERATION IDENTIFIER | IDENTIFIER COMPARISION_OPERATION MATH_EXPR
==================================================================
LOGIC_ARGS -> IDENTIFIER | COMP_EXPR | BOOL_OPT
LOGIC_EXPR -> LOGIC_OPERATION LOGIC_ARGS LOGIC_ARGS
=================================================================
COMPARATORS -> COMP_EXPR | LOGIC_EXPR | BOOL_OPT | IDENTIFIER
IF_ELSE -> if OPEN_PAREN COMPARATORS CLOSE_PAREN { EXPRESSIONS } else { EXPRESSIONS }
WHILE_LOOP -> while OPEN_PAREN COMPARATORS CLOSE_PAREN { EXPRESSIONS } 
FOR_LOOP -> for (IDENTIFIER in IDENTIFIER) { EXPRESSION } 
===============================================================
EXPR -> VARDEC | ASSIGNMENT | INPUT | OUTPUT | MATH_EXPR | LOGIC_EXPR | COMP_EXPR | IF_ELSE | WHILE_LOOP | FOR_LOOP
EXPRESSION ->  EXPRESSION DELIM | EXPRESSION 
================================================================
FUNCTION_ARGS -> DATATYPE IDENTIFIER ,|DATATYPE IDENTIFIER | ARGUMENTS | e
FUNCTION -> function IDENTIFIER OPEN_PARAM ARGUMENTS CLOSE_PARAM { EXPRESSION }
================================================================
S -> FUNCTION | S

