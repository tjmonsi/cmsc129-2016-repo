#!/usr/bin/python


actionlist = []
symbols = {}

index = 0
def execute(actions):
    global actionlist
    global index
    actionlist = actions
    
    while index <= len(actionlist) - 1:
        verify()
        index = index + 1
    
def verify():
    global index
    temp = actionlist[index]
    #print(temp.token)
    if temp.token.strip() is "print":
        index = index + 1
        printfunction()
    if temp.grammar.strip() is "VARDEC":
        vardec()
    if temp.token.strip() is "get":
        index = index + 1
        inputfunc()
    if temp.grammar.strip() is "MATH_EXPR":
        math_expr()
    if temp.token.strip() is "if":
        index = index + 1
        if_else()
    if temp.token.strip() is "while":
        index = index + 1
        while_loop()
    
    
def printfunction():
    global index
    temp = actionlist[index]
    
    if temp.type is "identifier":
        print(symbols[temp.token.strip()])
        
    elif temp.grammar is "MATH_EXPR":
        print(math_expr())
    else:
        print(temp.token.strip())
        
        
def vardec():
    global index # variable
    temp = actionlist[index]
    var = temp.token.strip()
    
    
    index = index + 1 # = 
    index = index + 1 # value
    temp = actionlist[index] 
    
    if temp.grammar is "MATH_EXPR":
        symbols[var] = math_expr()
    elif temp.type is "identifier":
        symbols[var] = symbols[temp.token.strip()]
    else:
        symbols[var] = temp.token.strip()
        
    
def inputfunc():
    global index
    temp = actionlist[index]
    if temp.type is "identifier":
        symbols[temp.token.strip()] = input()
       
    else:
        symbols["Filebuf"] = open(temp.token.strip()[1:len(temp.token.strip())-1]).read()
       
    
def math_expr():
    global index # variable
    temp = actionlist[index]
    x = 0
    y = 0
    if temp.type.strip() is "identifier":
        x = float(symbols[temp.token.strip()])
    else:
        x = float(temp.token.strip())
    index = index + 1
    temp = actionlist[index]
    operationFound = False
    operation = -1
    
    while temp.grammar.strip() is "MATH_EXPR" or temp.grammar.strip() is "MATH_EXPR_CONT":
        if operationFound == False:
            if temp.token.strip() is "+":
                operation = 1
            elif temp.token.strip() is "-":
                operation = 2
            elif temp.token.strip() is "/":
                operation = 4
            elif temp.token.strip() is "%":
                operation = 5
            elif temp.token.strip() is "*":
                operation = 3
            operationFound = True
        else:
            if temp.type.strip() is "identifier":
                y = float(symbols[temp.token.strip()])
            else:
                y = float(temp.token.strip())
                
            operationFound = False
            
            if operation == 1:
                x = x + y
            if operation == 2:
                x = x - y
            if operation == 3:
                x = x * y
            if operation == 4:
                x = x / y
            if operation == 5:
                x = x % y
            
                
        
        index = index + 1
        temp = actionlist[index]
    
    index = index - 1
    return x
                
def if_else():
    global index
    
    index = index + 1
    temp = actionlist[index]
     
    returned = comp_expr()
 
    index = index + 1
    temp = actionlist[index]
    
    if returned == True:
        while temp.token is not "}":
            
            verify()
            
            index = index + 1
            temp = actionlist[index]
        index = index + 1 
        temp = actionlist[index]
        
        if temp.token is "else":
            index = index + 1  # {
            index = index + 1
            temp = actionlist[index]
            
            while temp.token is not "}":
                
                index = index + 1
                temp = actionlist[index]
        else:
            index = index - 1
    else:
        while temp.token is not "}":
            
            index = index + 1
            temp = actionlist[index]
        index = index + 1 
        temp = actionlist[index]
        
        if temp.token is "else":
            index = index + 1  # {
            index = index + 1
            temp = actionlist[index]
            
            while temp.token is not "}":
                
                verify()
                
                index = index + 1
                temp = actionlist[index]
        else:
            index = index - 1

def while_loop():
    global index
    indexsave = index
    
    while True:
        index = index + 1
        temp = actionlist[index]
        
        returned = comp_expr()
    
        index = index + 1
        temp = actionlist[index]
        
        if returned == True:
            while temp.token is not "}":
            
                verify()
            
                index = index + 1
                temp = actionlist[index]
            index = indexsave
        else:
            while temp.token is not "}":
            
                index = index + 1
                temp = actionlist[index]
            break
        
    
    
def comp_expr():
    global index
    temp = actionlist[index]
    x = 0
    y = 0
    ret = False
    if temp.type.strip() is "identifier":
        x = float(symbols[temp.token.strip()])
    else:
        x = float(temp.token.strip())
        
    index = index + 1
    temp = actionlist[index]
    
    if temp.token.strip() is ">":
        operation = 1
    elif temp.token.strip() is "<":
        operation = 2
    elif temp.token.strip() is "==":
        operation = 3
    elif temp.token.strip() is "!=":
        operation = 4
    elif temp.token.strip() is ">=":
        operation = 5
    elif temp.token.strip() is "<=":
        operation = 6
        
    index = index + 1
    temp = actionlist[index]
    
    if temp.type.strip() is "identifier":
        y = float(symbols[temp.token.strip()])
    else:
        y = float(temp.token.strip())
        
    if operation == 1:
        ret = x > y
    if operation == 2:
        ret = x < y
    if operation == 3:
        ret = x == y
    if operation == 4:
        ret = x != y
    if operation == 5:
        ret = x >= y
    if operation == 6:
        ret = x <= y
    
    return ret
    
    
    
    
    
    

