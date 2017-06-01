import lexical_analyzer

class Parser():
        
    def __init__(self):
        self.lexemes = []
        self.lookahead = None
    
    def nextLexeme(self):
        if self.lexemes:
            self.lookahead = self.lexemes.pop(0)
            #print(self.lookahead[1])
            
    def assert_next(self, expected_value, error_message):
        if self.lookahead[0] == expected_value:
            self.nextLexeme()
        else:
            print(error_message + ' before ' + self.lookahead[1])
    
    def assert_delimiter(self):
        self.assert_next('SEMICOLON_KEYWORD', 'expected semicolon')
            
    def check_next(self, expected_values):
        if len(expected_values) == 1:
            return self.lookahead[0] == expected_values[0]
        for value in expected_values:
            if self.lookahead[0] == value:
                return True
        return False

    def parse(self, lexemes):
        self.lexemes = lexemes
        self.nextLexeme()
        while self.lexemes:
            self.function()
    
    def codeblock(self):
        self.assert_next('OPEN_CURLY_BRACE_KEYWORD', 'expected {')
        while not self.check_next(['CLOSE_CURLY_BRACE_KEYWORD']):
            self.statement()
        self.assert_next('CLOSE_CURLY_BRACE_KEYWORD', 'expected }')
            
    def statement(self):
        # STATEMENT := EXPRESSION | INPUT | OUTPUT | COMMENT | IFSTMT | SWITCHSTMT | LOOPSTMT | FUNCTIONDEC | RETURN | INCREMENT | DECREMENT | break | continue
        if self.check_next(['INPUT_KEYWORD']):
            self.input()
        elif self.check_next(['OUTPUT_KEYWORD']):
            self.output()
        elif self.check_next(['VAR_KEYWORD']):
            self.vardec()
        elif self.check_next(['SINGLE_LINE_COMMENT']):
            self.nextLexeme()
        elif self.check_next(['IF_KEYWORD']):
            self.ifstmt()
        elif self.check_next(['SWITCH_KEYWORD']):
            self.switch()
        elif self.check_next(['WHILE_KEYWORD']):
            self.while_loop()
        elif self.check_next(['DO_KEYWORD']):
            self.do_while_loop()
        elif self.check_next(['FOR_KEYWORD']):
            self.for_loop()
        elif self.check_next(['FOREACH_KEYWORD']):
            self.foreach_loop()
        elif self.check_next(['FUNCTION_KEYWORD']):
            self.function()
        elif self.check_next(['RETURN_KEYWORD']):
            self.returnstmt()
        elif self.check_next(['BREAK_KEYWORD']):
            self.breakstmt()
        elif self.check_next(['CONTINUE_KEYWORD']):
            self.continuestmt()
            
    def input(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.assert_next('IDENTIFIER', 'expected identifier')
        if self.check_next(['COMMA_KEYWORD']):
            self.nextLexeme()
            self.assert_next('STRING_LITERAL', 'expected string literal')
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        
    def output(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()

    def vardec(self):
        self.nextLexeme()
        self.assert_next('IDENTIFIER', 'expected identifier')
        if self.check_next(['EQUAL_SIGN_KEYWORD']):
            self.nextLexeme()
            if self.check_next(['OPEN_BRACKET_KEYWORD']):
                self.nextLexeme()
                while not self.check_next(['CLOSE_BRACKET_KEYWORD']):
                    self.expression()
                    if not self.check_next(['CLOSE_BRACKET_KEYWORD']):
                        self.assert_next('COMMA_KEYWORD', 'expected comma')
                self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
            else:
                self.expression()
        self.assert_delimiter()
            
    def ifstmt(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.codeblock()
        if self.check_next(['ELSIF_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
            self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            self.codeblock()
        if self.check_next(['ELSE_KEYWORD']):
            self.nextLexeme()
            self.codeblock()
            
    def switch(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_next('OPEN_CURLY_BRACE_KEYWORD', 'expected {')
        while not self.check_next(['CLOSE_CURLY_BRACE_KEYWORD']):
            self.caseblock()
            if self.check_next(['DEFAULT_KEYWORD']):
                break
        if self.check_next(['DEFAULT_KEYWORD']):
            self.nextLexeme()
            self.codeblock()
        self.assert_next('CLOSE_CURLY_BRACE_KEYWORD', 'expected }')
        
    def caseblock(self):
        self.assert_next('CASE_KEYWORD', 'expected case')
        if self.check_next(['STRING_LITERAL', 'INTEGER_LITERAL', 'FLOAT_LITERAL']):
            self.literal()
        else:
            print('expected literal at ' + self.lookahead[1])
        self.assert_next('INTEGER_LITERAL', 'expected literal')
        self.codeblock()
        
    def while_loop(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.codeblock()
        
    def do_while_loop(self):
        self.nextLexeme()
        self.codeblock()
        self.assert_next('WHILE_KEYWORD', 'expected while')
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        
    def for_loop(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.expression()
        self.assert_delimiter()
        self.expression()
        self.assert_delimiter()
        self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected (')
        self.codeblock()
        
    def foreach_loop(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('IN_KEYWORD', 'expected in')
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected (')
        self.codeblock()
        
    def function(self):
        self.nextLexeme()
        self.assert_next('IDENTIFIER', 'expected function identifier')
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        while not self.check_next(['CLOSE_PARENTHESIS_KEYWORD']):
            self.assert_next('IDENTIFIER', 'expected identifier')
            if not self.check_next(['CLOSE_PARENTHESIS_KEYWORD']):
                self.assert_next('COMMA_KEYWORD', 'expected comma')
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected (')
        self.codeblock()
        
    def returnstmt(self):
        self.nextLexeme()
        self.expression()
        self.assert_delimiter()
        
    def breakstmt(self):
        self.nextLexeme()
        self.assert_delimiter()

    def continuestmt(self):
        self.nextLexeme()
        self.assert_delimiter()

    def expression(self):
        self.operation()
    
    def operation(self):
        if self.term():
            if self.operator():
                self.nextLexeme()
                if self.operation():
                    return True
                else:
                    return False
            else:
                return True
        else:
            print('error at ' + self.lookahead[1])
            return False
    
    def term(self):
        if self.operand():
            if self.operator():
                self.nextLexeme()
                if self.term():
                    return True
                else:
                    return False
            else:
                return True
        else:
            print('error at ' + self.lookahead[1])
            return False


    def operand(self):
        if self.check_next(['OPEN_PARENTHESIS_KEYWORD']):
            self.nextLexeme()
            self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            return True
        else:
            if self.literal() or self.variable():
                self.nextLexeme()
                return True
            else:
                print('error at ' + self.lookahead[1])
                return False

    def operator(self):
        return self.check_next(['PLUS_KEYWORD', 'MINUS_KEYWORD', 'MULTIPLY_KEYWORD', 'DIVIDE_KEYWORD', 'MODULO_KEYWORD'])

    def literal(self):
        return self.check_next(['INTEGER_LITERAL', 'FLOAT_LITERAL', 'STRING_LITERAL', 'TRUE_KEYWORD', 'FALSE_KEYWORD'])

    def variable(self):
        return self.check_next(['IDENTIFIER'])

dfa = lexical_analyzer.create_DFA()
code = open('sample.ric', 'r').read().strip()
lexemes = dfa.tokenize(code)
print(lexemes)
parser = Parser()
parser.parse(lexemes)
