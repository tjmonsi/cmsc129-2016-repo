from Lexeme import Lexeme

class Node():
    Error = []
    def __init__(self, lx):
        self.lexemes = lx
        self.nextLexeme = self.lexemes.pop(0)
        self.backtrack = None
        return

    def parseError(self, err):
        self.Error.append(err)
        return

    def lookahead(self):
        self.backtrack = self.nextLexeme
        self.nextLexeme = self.lexemes.pop(0)
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
        if len(self.lexemes) != 0:
            self.lookahead()
            self.codeblock()
        return

    def statement(self):
        #<STATEMENT>:= <EXPRESSION>|<VARDEC>|<ARRAYDEC>|<ASSIGN>|<IF-THEN>|<FOR-LOOP>|<WHILE-LOOP>|<DO-WHILE-LOOP>|<FUNCTIONDEC>|<FUNCTIONCALL>|<OUTPUT>|<INPUT>
        if self.nextLexeme.label == 'new':
            self.lookahead()
            self.varDec()

        if self.operand():
            if expression():
        return

    def varDec(self):
        #<VARDEC>:= new <VARIDENT><LINE-DELIMITER>
        if self.nextLexeme.label == 'Variable Identifier':
            self.lookahead()
        else:
            self.parseError('Expected Variable Identifier at line '+str(self.backtrack.lineNumber))

        if self.nextLexeme.label == ';':
            self.lookahead()
        else:
            self.parseError('Expected \';\' at line '+str(self.backtrack.lineNumber))
        return

    def expression():
        if not self.operand()
            self.parseError('Expected operand at line '+str(self.backtrack.lineNumber))
            return False

        return True

    def operation():
        if self.nextLexeme.label in ['+', '-', '*', '/', '%']:
            self.lookahead()
            if self.operand():
        else:
            return False
        return True

    def operand():
        if self.nextLexeme.label in ['Integer Literal', 'Float Literal', 'String Literal', 'Variable Identifier']:


def parser(tokens):
    global PTree
    PTree = Node(tokens)
    PTree.parse()

    for s in PTree.Error:
        print("Syntax Error: "+s)
    return
