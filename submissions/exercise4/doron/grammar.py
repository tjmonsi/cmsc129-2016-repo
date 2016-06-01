#!/usr/bin/python


import tokengenerator


grammarlist = {}

class Grammar:
    
    def __init__(self, name):
        self.name = name
        self.grammarlist = []
        
class GrammarContent:
    
    def __init__(self,token,type):
        self.token = token
        self.type = type

def addGrammars():
    start = Grammar("START")
    start.grammarlist.append([GrammarContent("function", 1), GrammarContent("identifier", 3), GrammarContent("(", 1), GrammarContent("FUNCTION_ARGS", 2),GrammarContent(")", 1), GrammarContent("{", 1), GrammarContent("EXPR",2), GrammarContent("}", 1)])
    
    grammarlist["START"] = start
    
    function_args = Grammar("FUNCTION_ARGS")
    function_args.grammarlist.append([GrammarContent("identifier",3), GrammarContent("FUNCTION_CONT", 2)])
    function_args.grammarlist.append([GrammarContent("eps",4)])
    
    grammarlist["FUNCTION_ARGS"] = function_args
    
    function_cont = Grammar("FUNCTION_CONT")
    function_cont.grammarlist.append([GrammarContent(",", 1), GrammarContent("identifier",3)])
    function_cont.grammarlist.append([GrammarContent("eps",4)])
    
    grammarlist["FUNCTION_CONT"] = function_cont
    
    expr = Grammar("EXPR")
    expr.grammarlist.append([GrammarContent("VARDEC",2), GrammarContent("EXPR_CONT",2)])
    expr.grammarlist.append([GrammarContent("INPUT",2), GrammarContent("EXPR_CONT",2)])
    expr.grammarlist.append([GrammarContent("OUTPUT",2), GrammarContent("EXPR_CONT",2)])
    expr.grammarlist.append([GrammarContent("IF_ELSE",2), GrammarContent("EXPR_CONT",2)])
    expr.grammarlist.append([GrammarContent("WHILE_LOOP",2), GrammarContent("EXPR_CONT",2)])
    
    
    grammarlist["EXPR"] = expr
    
    expr_cont = Grammar("EXPR_CONT")
    expr_cont.grammarlist.append([GrammarContent("VARDEC",2), GrammarContent("EXPR_CONT",2)])
    expr_cont.grammarlist.append([GrammarContent("INPUT",2), GrammarContent("EXPR_CONT",2)])
    expr_cont.grammarlist.append([GrammarContent("OUTPUT",2), GrammarContent("EXPR_CONT",2)])
    expr_cont.grammarlist.append([GrammarContent("IF_ELSE",2), GrammarContent("EXPR_CONT",2)])
    expr_cont.grammarlist.append([GrammarContent("WHILE_LOOP",2), GrammarContent("EXPR_CONT",2)])
                                 
    expr_cont.grammarlist.append([GrammarContent("eps",4)])                                 

    grammarlist["EXPR_CONT"] = expr_cont
    
    vardec = Grammar("VARDEC")
    vardec.grammarlist.append([GrammarContent("identifier",3), GrammarContent("VARDEC_CONT",2), ])
    
    grammarlist["VARDEC"] = vardec
    
    vardec_cont = Grammar("VARDEC_CONT")
    vardec_cont.grammarlist.append([GrammarContent("EQUATION",2)])
    vardec_cont.grammarlist.append([GrammarContent("eps",4)])
    
    grammarlist["VARDEC_CONT"] = vardec_cont
     
    equation = Grammar("EQUATION")
    equation.grammarlist.append([GrammarContent("=",1), GrammarContent("VALID_EQUATORS",2)])
    
    
    grammarlist["EQUATION"] = equation
    
    valid_equators = Grammar("VALID_EQUATORS")
    
    valid_equators.grammarlist.append([GrammarContent("MATH_EXPR",2)])
    valid_equators.grammarlist.append([GrammarContent("string",3)])
    valid_equators.grammarlist.append([GrammarContent("integer",3)])
    valid_equators.grammarlist.append([GrammarContent("double",3)])
    valid_equators.grammarlist.append([GrammarContent("identifier",3)])
    
    
    grammarlist["VALID_EQUATORS"] = valid_equators
    
    input_ = Grammar("INPUT")
    input_.grammarlist.append([GrammarContent("get",1), GrammarContent("string",3)])
    input_.grammarlist.append([GrammarContent("get",1), GrammarContent("identifier",3)])
    
    grammarlist["INPUT"] = input_
    
    output = Grammar("OUTPUT")
    output.grammarlist.append([GrammarContent("print",1),GrammarContent("VALID_EQUATORS",2)])
    
    grammarlist["OUTPUT"] = output
    
    math_expr = Grammar("MATH_EXPR")
    
    math_expr.grammarlist.append([GrammarContent("integer",3), GrammarContent("math_op",3), GrammarContent("integer",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    math_expr.grammarlist.append([GrammarContent("double",3), GrammarContent("math_op",3), GrammarContent("double",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    math_expr.grammarlist.append([GrammarContent("identifier",3), GrammarContent("math_op",3), GrammarContent("identifier",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    math_expr.grammarlist.append([GrammarContent("integer",3), GrammarContent("math_op",3), GrammarContent("double",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    math_expr.grammarlist.append([GrammarContent("integer",3), GrammarContent("math_op",3), GrammarContent("identifier",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    math_expr.grammarlist.append([GrammarContent("double",3), GrammarContent("math_op",3), GrammarContent("identifier",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    math_expr.grammarlist.append([GrammarContent("double",3), GrammarContent("math_op",3), GrammarContent("integer",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    math_expr.grammarlist.append([GrammarContent("identifier",3), GrammarContent("math_op",3), GrammarContent("integer",3), GrammarContent("MATH_EXPR_CONT",2)])
     
    math_expr.grammarlist.append([GrammarContent("identifier",3), GrammarContent("math_op",3), GrammarContent("double",3), GrammarContent("MATH_EXPR_CONT",2)])
    
    
    
    grammarlist["MATH_EXPR"] = math_expr
    
    
    
    
    math_expr_cont = Grammar("MATH_EXPR_CONT")
    math_expr_cont.grammarlist.append([GrammarContent("math_op",3),GrammarContent("integer",3), GrammarContent("MATH_EXPR_CONT",2)])
    math_expr_cont.grammarlist.append([GrammarContent("math_op",3),GrammarContent("double",3), GrammarContent("MATH_EXPR_CONT",2)])
    math_expr_cont.grammarlist.append([GrammarContent("math_op",3),GrammarContent("identifier",3), GrammarContent("MATH_EXPR_CONT",2)])
    math_expr_cont.grammarlist.append([GrammarContent("eps",4)])
    
    grammarlist["MATH_EXPR_CONT"] = math_expr_cont
    
    
    if_else = Grammar("IF_ELSE")
    if_else.grammarlist.append([GrammarContent("if",1), GrammarContent("(",1), GrammarContent("COMP_EXPR",2), GrammarContent(")",1), GrammarContent("{",1), GrammarContent("EXPR",2), GrammarContent("}",1), GrammarContent("else",1), GrammarContent("{",1), GrammarContent("EXPR",2), GrammarContent("}",1)])
    if_else.grammarlist.append([GrammarContent("if",1), GrammarContent("(",1), GrammarContent("COMP_EXPR",2), GrammarContent(")",1), GrammarContent("{",1), GrammarContent("EXPR",2), GrammarContent("}",1)])
    
    grammarlist["IF_ELSE"] = if_else
    
    while_loop = Grammar("WHILE_LOOP")
    
    while_loop.grammarlist.append([GrammarContent("while",1), GrammarContent("(",1), GrammarContent("COMP_EXPR",2), GrammarContent(")",1), GrammarContent("{",1), GrammarContent("EXPR",2), GrammarContent("}",1)])
    
    grammarlist["WHILE_LOOP"] = while_loop
    
    
    comp_expr = Grammar("COMP_EXPR")
    comp_expr.grammarlist.append([GrammarContent("identifier",3), GrammarContent("comp_op",3), GrammarContent("identifier",3)])
    comp_expr.grammarlist.append([GrammarContent("integer",3), GrammarContent("comp_op",3), GrammarContent("integer",3)])
    comp_expr.grammarlist.append([GrammarContent("double",3), GrammarContent("comp_op",3), GrammarContent("double",3)])
    comp_expr.grammarlist.append([GrammarContent("identifier",3), GrammarContent("comp_op",3), GrammarContent("integer",3)])
    comp_expr.grammarlist.append([GrammarContent("identifier",3), GrammarContent("comp_op",3), GrammarContent("double",3)])
    comp_expr.grammarlist.append([GrammarContent("integer",3), GrammarContent("comp_op",3), GrammarContent("identifier",3)])
    comp_expr.grammarlist.append([GrammarContent("integer",3), GrammarContent("comp_op",3), GrammarContent("double",3)])
    comp_expr.grammarlist.append([GrammarContent("double",3), GrammarContent("comp_op",3), GrammarContent("identifier",3)])
    comp_expr.grammarlist.append([GrammarContent("double",3), GrammarContent("comp_op",3), GrammarContent("integer",3)])
    
    grammarlist["COMP_EXPR"] = comp_expr
    
    #X.grammarlist.append([])
    #GrammarContent("#",X)
    


class GrammarParsed:
    
    def __init__(self,token,grammar,type):
        self.token = token
        self.grammar = grammar
        self.type = type
class ReturnCatcher:
    
    def __init__(self):
        self.fail = False
        self.grammar = []
        self.error_messages = []
        self.index = 0;



def checkGrammar(grammarinp, index):
    
    
    
    s = grammarlist[grammarinp]
    ret = ReturnCatcher()
    fail = False
    tempindex = index
    
    for x in s.grammarlist:
        ret = ReturnCatcher()
        fail = False
        index = tempindex
        for y in x:
            #print(y.token)
            temp = tokengenerator.tokenlist[index]
            #print(str(index)+" "+s.name+" check"+temp.token+" "+ str(temp.value) +" with"+y.token)
            if(y.type == 1):
                if y.token.strip() is temp.token.strip():
                    ret.grammar.append(GrammarParsed(temp.token.strip(), s.name, "None" ))
                    index = index + 1
                else:
                    fail = True
                    
                    ret.error_messages.append("SYNTAX ERROR: EXPECTED"+y.token+" GOT " + temp.token)
                    
                    break
            elif(y.type == 2):
                temp_1 = checkGrammar(y.token, index)
                
                if temp_1.fail == True:
                    for errors in temp_1.error_messages:
                        ret.error_messages.append(errors)
                    fail = True
                    break
                else:
                    for gram in temp_1.grammar:
                        ret.grammar.append(gram)
                    index = temp_1.index
            elif(y.type == 3):
                if y.token.strip() is temp.token.strip():
                    ret.grammar.append(GrammarParsed(temp.value.strip(), s.name, temp.token ))
                    index = index + 1
                else:
                    fail = True
                    
                    ret.error_messages.append("SYNTAX ERROR: EXPECTED"+y.token+" GOT " + temp.token)
                    break
       
        if(fail == True):
            #print("fail")
            ret.fail = True
            #ret.error_messages = []
            ret.grammar = []
            ret.index = tempindex
            
        else:
            
            ret.fail = False
            ret.index = index
            return ret
        
   # print("fail2")
    ret.fail = True
   # ret.error_messages = []
    ret.grammar = []
    ret.index = index
    return ret
    
