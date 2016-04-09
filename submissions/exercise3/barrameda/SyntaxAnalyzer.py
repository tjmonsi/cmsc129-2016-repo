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
        #if token in PTree.grammar:
        #    print("wow")
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
                self.parseError('Expected condition for if-condition at line '+str(ifIndex))
            if self.nextLexeme.label == '{':
                self.lookahead()
                while self.nextLexeme.label != '}':
                    if self.index == len(self.lexemes):
                        self.parseError('Expected \'}\' for if-conditon at line '+str(ifIndex))
                        return
                    self.statement()
                    self.lookahead()
            else:
                self.parseError('Expected \'{\' for if-conditon at line '+str(ifIndex))
        else:
            self.parseError('Expected \'(\' for if-condition at line '+str(ifIndex))

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
