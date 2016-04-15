from Lexeme import Lexeme

class Node():
    Error = []
    def __init__(self, lx):
        self.index = 0
        self.lexemes = lx
        self.nextLexeme = self.lexemes[0]
        self.prevLexeme = None
        return

    def parseError(self, err):
        self.Error.append(err)
        return

    def lookahead(self):
        self.index += 1
        if self.index < len(self.lexemes):
            self.prevLexeme = self.nextLexeme
            self.nextLexeme = self.lexemes[self.index]
        return

    def backtrack(self):
        self.index -= 1
        if self.index > 0 and self.index < len(self.lexemes):
            self.nextLexeme = self.lexemes[self.index]
        return

    def parse(self):
        self.codeblock()
        return

    def codeblock(self):
        #<CODEBLOCK>:= <STATEMENT>
        self.statement()

        #<CODEBLOCK>:= <STATEMENT><CODEBLOCK>
        if self.index < len(self.lexemes):
            self.lookahead()
            self.codeblock()
        return

    def statement(self):
        #<STATEMENT>:= <EXPRESSION>|<VARDEC>|<ARRAYDEC>|<ASSIGN>|<IF-THEN>|<FOR-LOOP>|<WHILE-LOOP>|<DO-WHILE-LOOP>|<FUNCTIONDEC>|<FUNCTIONCALL>|<OUTPUT>|<INPUT>

        if self.nextLexeme.label == 'new':
            self.lookahead()
            self.varDec()
        elif self.nextLexeme.label == 'if':
            self.lookahead()
            self.ifcond()
            self.lookahead()
            if self.nextLexeme.label == 'else':
                self.lookahead()
                self.elsecond()
            else:
                self.backtrack()
        elif self.nextLexeme.label == 'for':
            self.lookahead()
            self.forLoop()
        elif self.nextLexeme.label == 'while':
            self.lookahead()
            self.whileLoop()
        elif self.nextLexeme.label == 'do':
            self.lookahead()
            self.doLoop()
        elif self.nextLexeme.label == 'func':
            self.lookahead()
            self.funcDec()
        elif self.operand():
            self.expression()
        return

    def varDec(self):
        #<VARDEC>:= new <VARIDENT><LINE-DELIMITER>
        if self.nextLexeme.label == 'Variable Identifier':
            self.lookahead()
            if self.nextLexeme.label != ';':
                self.parseError('Expected \';\' at line '+str(self.prevLexeme.lineNumber))
        else:
            self.parseError('Expected Variable Identifier at line '+str(self.prevLexeme.lineNumber))

        return

    def assign(self):
        if self.nextLexeme.label == 'Variable Identifier':
            self.lookahead()
            if self.nextLexeme.label == '=':
                self.lookahead()
                if self.operation():
                    return True
                elif self.operand():
                    self.lookahead()
                    return True
                else:
                    self.backtrack()
        return False

    def contentBlock(self, name, index):
        if self.nextLexeme.label == '{':
            self.lookahead()
            while self.nextLexeme.label != '}':
                if self.index == len(self.lexemes):
                    self.parseError('Expected \'}\' for '+name+' at line '+str(index))
                    return False
                self.statement()
                self.lookahead()
        else:
            self.parseError('Expected \'{\' for '+name+' at line '+str(index))
            return False
        return True

    def ifcond(self):
        ifIndex = self.prevLexeme.lineNumber
        if self.nextLexeme.label == '(':
            self.lookahead()
            if self.booleanOp():
                if self.nextLexeme.label == ')':
                    self.lookahead()
                else:
                    self.parseError('Expected \')\' at line '+str(self.nextLexeme.lineNumber))
            else:
                self.parseError('Expected boolean condition for if-condition at line '+str(ifIndex))
            if not self.contentBlock('if-condition', ifIndex):
                return
        else:
            self.parseError('Expected \'(\' for if-condition at line '+str(ifIndex))

        self.lookahead()
        if self.nextLexeme.label == 'elsif':
            self.lookahead()
            self.ifcond()
        else:
            self.backtrack()

        return

    def elsecond(self):
        elseIndex = self.prevLexeme.lineNumber
        if self.nextLexeme.label == '{':
            self.lookahead()
            while self.nextLexeme.label != '}':
                if self.index == len(self.lexemes):
                    self.parseError('Expected \'}\' for else-conditon at line '+str(elseIndex))
                    return
                self.statement()
                self.lookahead()
        else:
            self.parseError('Expected \'{\' for else-conditon at line '+str(elseIndex))
        return

    def forLoop(self):
        forIndex = self.prevLexeme.lineNumber
        if self.nextLexeme.label == '(':
            self.lookahead()
            if self.assign():
                if self.nextLexeme.label == ';':
                    self.lookahead()
                    if self.booleanOp():
                        if self.nextLexeme.label == ';':
                            self.lookahead()
                            if self.assign():
                                if self.nextLexeme.label == ')':
                                    self.lookahead()
                                else:
                                    self.parseError('Expected \')\' at line '+str(self.nextLexeme.lineNumber))
                            else:
                                self.parseError('Expected expression for argument 3 in for condition at line '+str(forIndex))
                        else:
                             self.parseError('Expected \';\' after argument 2 in for condition at line '+str(forIndex))
                    else:
                        self.parseError('Expected boolean for argument 2 in for condition at line '+str(forIndex))
                else:
                     self.parseError('Expected \';\' after argument 1 in for condition at line '+str(forIndex))
            else:
                self.parseError('Expected expression for argument 1 in for condition at line '+str(forIndex))
            if not self.contentBlock('for-loop', forIndex):
                return
        else:
            self.parseError('Expected \'(\' for for-loop at line '+str(forIndex))
        return

    def whileLoop(self):
        whileIndex = self.prevLexeme.lineNumber
        if self.nextLexeme.label == '(':
            self.lookahead()
            if self.booleanOp():
                if self.nextLexeme.label == ')':
                    self.lookahead()
                else:
                    self.parseError('Expected \')\' at line '+str(self.nextLexeme.lineNumber))
            else:
                self.parseError('Expected boolean condition for while-loop at line '+str(whileIndex))
            if not self.contentBlock('while-loop', whileIndex):
                return
        else:
            self.parseError('Expected \'(\' for while-loop at line '+str(whileIndex))
        return

    def doLoop(self):
        doIndex = self.prevLexeme.lineNumber
        if self.contentBlock('do-while-loop', doIndex):
            self.lookahead()
            if self.nextLexeme.label == 'while':
                self.lookahead()
                if self.nextLexeme.label == '(':
                    self.lookahead()
                    if self.booleanOp():
                        if self.nextLexeme.label == ')':
                            self.lookahead()
                        else:
                            self.parseError('Expected \')\' at line '+str(self.nextLexeme.lineNumber))
                    else:
                        self.parseError('Expected boolean condition for do-while-loop at line '+str(doIndex))
                    if self.nextLexeme.label == ";":
                        self.lookahead()
                    else:
                        self.parseError('Expected \';\' at line '+str(self.prevLexeme.lineNumber))
                else:
                    self.parseError('Expected \'(\' for do-while-loop at line '+str(doIndex))
            else:
                self.parseError('Expected while part for do-while-loop at line '+str(doIndex))
        return

    def funcDec(self):
        funcIndex = self.prevLexeme.lineNumber
        if self.nextLexeme.label == 'Variable Identifier':
            self.lookahead()
            if self.nextLexeme.label == '(':
                self.lookahead()
                while self.nextLexeme.label != ')':
                    if self.nextLexeme.label == 'Variable Identifier':
                        self.lookahead()
                        if self.nextLexeme.label == ',':
                            self.lookahead()
                    else:
                        self.parseError('Invalid argument for function declaration at line '+str(funcIndex))
                        while self.nextLexeme.label not in [',', ')']:
                            self.lookahead()
                self.lookahead()
                self.contentBlock('function-declaration', funcIndex)
            else:
                self.parseError('Expected \'(\' for function declaration at line '+str(funcIndex))
        return

    def expression(self):
        if not self.operand():
            return False
        if self.operation():
            if self.nextLexeme.label != ';':
                self.parseError('Expected \';\' at line '+str(self.prevLexeme.lineNumber))
        return True

    def operation(self):
        if self.operand():
            self.lookahead()
            if self.nextLexeme.label in ['+', '-', '*', '/', '%']:
                self.lookahead()
                if not self.operation():
                    if self.operand():
                        self.lookahead()
                        return True
                    else:
                        self.parseError('Invalid operation syntax at line'+str(self.prevLexeme.lineNumber))
                        self.backtrack()
                else:
                    return True
            else:
                self.backtrack()
        if self.nextLexeme.label == '(':
            self.lookahead()
            if self.operation():
                if self.nextLexeme.label == ')':
                    self.lookahead()
                    return True
                else:
                    self.parseError('Expected \')\' at line'+str(self.nextLexeme.lineNumber))
        return False

    def operand(self):
        if self.nextLexeme.label in ['Integer Literal', 'Float Literal', 'String Literal', 'Variable Identifier', '(']:
            return True
        return False

    def booleanOp(self):
        if self.boolean():
            self.lookahead()
            if self.nextLexeme.label in ['and', 'or']:
                self.lookahead()
                if not self.booleanOp():
                    if self.boolean():
                        self.lookahead()
                        return True
                    else:
                        self.parseError('Invalid operation syntax at line'+str(self.prevLexeme.lineNumber))
                        self.backtrack()
                else:
                    return True
            else:
                self.backtrack()

        if self.nextLexeme.label == '(':
            self.lookahead()
            if self.booleanOp():
                if self.nextLexeme.label == ')':
                    self.lookahead()
                    return True
                else:
                    self.parseError('Expected \')\' at line'+str(self.nextLexeme.lineNumber))

        if self.boolean():
            self.lookahead()
            return True
        return False

    def boolean(self):
        if self.nextLexeme.label in ['true', 'false', 'Variable Identifier', '(']:
            return True
        return False

def parser(tokens):
    global PTree
    PTree = Node(tokens)
    PTree.parse()

    for s in PTree.Error:
        print("Syntax Error: "+s)
    return
