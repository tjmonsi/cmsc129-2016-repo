from . import evaluate

class Parser():

    def __init__(self, variables):
        self.lexemes = []
        self.lookahead = None
        self.tokens = []
        self.parse_tree = []
        self.variables = variables
        self.types = {
            'TRUE_KEYWORD': 'boolean',
            'FALSE_KEYWORD': 'boolean',
            'INTEGER_LITERAL': 'int',
            'FLOAT_LITERAL': 'float',
            'STRING_LITERAL': 'string'
        }

    def nextLexeme(self):
        if self.lexemes:
            self.lookahead = self.lexemes.pop(0)
            # print(self.lookahead[1])
        else:
            self.lookahead = ('eof', 'END OF FILE')

    def assert_next(self, expected_value, error_message):
        if self.lookahead[0] == expected_value:
            self.nextLexeme()
            return True
        else:
            print(error_message + ' before ' + self.lookahead[1])
            return False

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
        while not self.lookahead[0] == 'eof':
            t = self.statement()
            if isinstance(t, list):
                self.parse_tree.extend(t)
            else:
                self.parse_tree.append(t)
        return self.parse_tree

    def codeblock(self):
        stmts = []
        self.assert_next('OPEN_CURLY_BRACE_KEYWORD', 'expected {')
        while not self.check_next(['CLOSE_CURLY_BRACE_KEYWORD', 'eof']):
            t = self.statement()
            if isinstance(t, list):
                stmts.extend(t)
            else:
                stmts.append(t)
        self.assert_next('CLOSE_CURLY_BRACE_KEYWORD', 'expected }')
        return stmts

    def statement(self):
        # STATEMENT := EXPRESSION | INPUT | OUTPUT | COMMENT | IFSTMT |
        #              SWITCHSTMT | LOOPSTMT | FUNCTIONDEC | RETURN |
        #              break | continue
        if self.check_next(['INPUT_KEYWORD']):
            return self.input()
        elif self.check_next(['OUTPUT_KEYWORD']):
            return self.output()
        elif self.check_next(['VAR_KEYWORD']):
            return self.vardec()
        elif self.check_next(['SINGLE_LINE_COMMENT']):
            self.nextLexeme()
        elif self.check_next(['IF_KEYWORD']):
            return self.ifstmt()
        elif self.check_next(['SWITCH_KEYWORD']):
            self.switch()
        elif self.check_next(['WHILE_KEYWORD']):
            return self.while_loop()
        elif self.check_next(['DO_KEYWORD']):
            return self.do_while_loop()
        elif self.check_next(['FOR_KEYWORD']):
            return self.for_loop()
        elif self.check_next(['FOREACH_KEYWORD']):
            self.foreach_loop()
        elif self.check_next(['FUNCTION_KEYWORD']):
            self.function()
        elif self.check_next(['RETURN_KEYWORD']):
            self.returnstmt()
        elif self.check_next(['BREAK_KEYWORD']):
            return self.breakstmt()
        elif self.check_next(['CONTINUE_KEYWORD']):
            return self.continuestmt()
        elif self.check_next(['OPEN_KEYWORD']):
            return self.openstmt()
        elif self.check_next(['WRITE_KEYWORD']):
            return self.writestmt()
        elif self.check_next(['WRITELINE_KEYWORD']):
            return self.writelinestmt()
        elif self.check_next(['APPEND_KEYWORD']):
            return self.appendstmt()
        elif self.check_next(['IDENTIFIER']):
            cur = self.lookahead
            self.nextLexeme()
            if self.check_next(['EQUAL_SIGN_KEYWORD']):
                ass = self.assignment(cur[1], None)
                self.assert_delimiter()
                return ass;
            elif self.check_next(['INCREMENT_KEYWORD']):
                self.nextLexeme()
                self.assert_delimiter()
                return evaluate.Increment(self.variables, cur[1])
            elif self.check_next(['DECREMENT_KEYWORD']):
                self.nextLexeme()
                self.assert_delimiter()
                return evaluate.Decrement(self.variables, cur[1])
            elif self.check_next(['OPEN_BRACKET_KEYWORD']):
                self.nextLexeme()
                pos = self.expression()
                self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
                if self.check_next(['EQUAL_SIGN_KEYWORD']):
                    ass = self.assignment(cur[1], pos)
                    self.assert_delimiter()
                    return ass;
                return evaluate.Variable(self.variables, cur[1], pos)
            else:
                print('unknown statement at ' + cur[1])
                if self.check_next(['SEMICOLON_KEYWORD']):
                    self.nextLexeme()
        else:
            print('unknown statement at ' + self.lookahead[1])
            self.nextLexeme()

    def input(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        name = self.lookahead[1]
        mess = None
        self.assert_next('IDENTIFIER', 'expected identifier')
        if self.check_next(['OPEN_BRACKET_KEYWORD']):
            self.nextLexeme()
            self.expression()
            self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
        if self.check_next(['COMMA_KEYWORD']):
            self.nextLexeme()
            mess = self.lookahead[1]
            self.assert_next('STRING_LITERAL', 'expected string literal')
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        return evaluate.Input(self.variables, name, mess)

    def output(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        expr = self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        return evaluate.Output(expr)

    def appendstmt(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        name = self.lookahead[1]
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('COMMA_KEYWORD', 'expected ,')
        expr = self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        return evaluate.Append(self.variables, name, expr)

    def openstmt(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        path = None
        if self.check_next(['IDENTIFIER']):
            path = evaluate.Variable(self.variables, self.lookahead[1], None)
            self.nextLexeme()
            if self.check_next(['OPEN_BRACKET_KEYWORD']):
                self.nextLexeme()
                self.expression()
                self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
        elif self.check_next(['STRING_LITERAL']):
            path = self.lookahead[1]
            self.nextLexeme()
        else:
            print('expected variable identifier or string literal before ' + self.lookahead[1])
        self.assert_next('COMMA_KEYWORD', 'expected ,')
        mode = self.lookahead[1]
        self.assert_next('STRING_LITERAL', 'expected string literal')
        self.assert_next('COMMA_KEYWORD', 'expected ,')
        name = self.lookahead[1]
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        return evaluate.Open(path, mode, name, self.variables)

    def writestmt(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        name = self.lookahead[1]
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('COMMA_KEYWORD', 'expected ,')
        value = None
        if self.check_next(['IDENTIFIER']):
            source_iden = self.lookahead[1]
            self.nextLexeme()
            pos = None
            if self.check_next(['OPEN_BRACKET_KEYWORD']):
                self.nextLexeme()
                pos = self.expression()
                self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
            value = evaluate.Variable(self.variables, source_iden, pos)
        elif self.check_next(['STRING_LITERAL']):
            value = self.lookahead[1]
            self.nextLexeme()
        else:
            print('expected variable identifier or string literal before ' + self.lookahead[1])
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        return evaluate.Write(self.variables, name, value)

    def writelinestmt(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        name = self.lookahead[1]
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('COMMA_KEYWORD', 'expected ,')
        value = None
        if self.check_next(['IDENTIFIER']):
            source_iden = self.lookahead[1]
            self.nextLexeme()
            pos = None
            if self.check_next(['OPEN_BRACKET_KEYWORD']):
                self.nextLexeme()
                pos = self.expression()
                self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
            value = evaluate.Variable(self.variables, source_iden, pos)
        elif self.check_next(['STRING_LITERAL']):
            value = self.lookahead[1]
            self.nextLexeme()
        else:
            print('expected variable identifier or string literal before ' + self.lookahead[1])
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        return evaluate.WriteLine(self.variables, name, value)

    def assignment(self, var_name, pos):
        self.assert_next('EQUAL_SIGN_KEYWORD', 'expected =')
        if self.check_next(['OPEN_BRACKET_KEYWORD']):
            self.nextLexeme()
            vals = [];
            while not self.check_next(['CLOSE_BRACKET_KEYWORD']):
                expr = self.expression()
                if expr:
                    vals.append(expr)
                    if not self.check_next(['CLOSE_BRACKET_KEYWORD', 'SEMICOLON_KEYWORD', 'eof']):
                        self.assert_next('COMMA_KEYWORD', 'expected comma')
                    if self.check_next(['SEMICOLON_KEYWORD', 'eof']):
                        print('expected ] before ' + self.lookahead[1])
                        break
                else:
                    if not self.check_next(['CLOSE_BRACKET_KEYWORD', 'SEMICOLON_KEYWORD', 'eof']):
                        print('expected ] before ' + self.lookahead[1])
                        break

            self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
            return evaluate.Assignment(self.variables, var_name, pos, ('array', vals))
        else:
            expr = self.expression()
            return evaluate.Assignment(self.variables, var_name, pos, ('single', expr))

    def vardec(self):
        self.nextLexeme()
        name = self.lookahead[1]
        varde = []
        if self.assert_next('IDENTIFIER', 'expected identifier'):
            self.variables[name] = {
                'type': 'undefined',
                'value': None
            }
        varde.append(evaluate.VarDec(self.variables, name))
        if self.check_next(['EQUAL_SIGN_KEYWORD']):
            # self.nextLexeme()
            # if self.check_next(['OPEN_BRACKET_KEYWORD']):
            #     self.nextLexeme()
            #     while not self.check_next(['CLOSE_BRACKET_KEYWORD']):
            #         self.expression()
            #         if not self.check_next(['CLOSE_BRACKET_KEYWORD']):
            #             self.assert_next('COMMA_KEYWORD', 'expected comma')
            #     self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
            # else:
            #     self.expression()
            varde.append(self.assignment(name, None))
        self.assert_delimiter()
        return varde

    def ifstmt(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        cond = self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        then = self.codeblock()
        elsif_cond = None
        elsif_block = None
        if self.check_next(['ELSIF_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
            elsif_cond = self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            elsif_block = self.codeblock()
        else_block = None
        if self.check_next(['ELSE_KEYWORD']):
            self.nextLexeme()
            else_block = self.codeblock()
        return evaluate.IfThenElse(cond, then, elsif_cond, elsif_block, else_block)

    def switch(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        if self.variable():
            self.nextLexeme()
        else:
            print('expected variable identifier before ' + self.lookahead[1])
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_next('OPEN_CURLY_BRACE_KEYWORD', 'expected {')
        while not self.check_next(['CLOSE_CURLY_BRACE_KEYWORD', 'eof']):
            if self.check_next(['DEFAULT_KEYWORD']):
                break
            self.caseblock()
        if self.check_next(['DEFAULT_KEYWORD']):
            self.nextLexeme()
            self.assert_next('COLON_KEYWORD', 'expected :')
            self.codeblock()
        self.assert_next('CLOSE_CURLY_BRACE_KEYWORD', 'expected }')

    def caseblock(self):
        self.assert_next('CASE_KEYWORD', 'expected case')
        if self.literal():
            self.nextLexeme()
        else:
            print('expected literal at ' + self.lookahead[1])
        self.assert_next('COLON_KEYWORD', 'expected :')
        # self.assert_next('INTEGER_LITERAL', 'expected literal')
        self.codeblock()

    def while_loop(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        cond = self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        loop = self.codeblock()
        return evaluate.WhileLoop(cond, loop)

    def do_while_loop(self):
        self.nextLexeme()
        loop = self.codeblock()
        self.assert_next('WHILE_KEYWORD', 'expected while')
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        cond = self.expression()
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.assert_delimiter()
        return evaluate.DoWhileLoop(loop, cond)

    def for_loop(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        if self.check_next(['CLOSE_PARENTHESIS_KEYWORD']):
            self.nextLexeme()
        else:
            init = self.statement()
            cond = self.expression()
            self.assert_delimiter()
            last = self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        loop = self.codeblock()
        return evaluate.ForLoop(init, cond, loop, last)

    def foreach_loop(self):
        self.nextLexeme()
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('IN_KEYWORD', 'expected in')
        self.assert_next('IDENTIFIER', 'expected identifier')
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.codeblock()

    def function(self):
        self.nextLexeme()
        self.assert_next('IDENTIFIER', 'expected function identifier')
        self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
        while not self.check_next(['CLOSE_PARENTHESIS_KEYWORD']):
            self.assert_next('IDENTIFIER', 'expected identifier')
            if not self.check_next(['CLOSE_PARENTHESIS_KEYWORD']):
                self.assert_next('COMMA_KEYWORD', 'expected comma')
        self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
        self.codeblock()

    def returnstmt(self):
        self.nextLexeme()
        self.expression()
        self.assert_delimiter()

    def breakstmt(self):
        self.nextLexeme()
        self.assert_delimiter()
        return evaluate.Break()

    def continuestmt(self):
        self.nextLexeme()
        self.assert_delimiter()
        return evaluate.Continue()

    def expression(self):
        operators = []
        operands = []
        self.evaluate_expression(operators, operands)
        return evaluate.Expression(operators, operands)

    def evaluate_expression(self, operators, operands):
        if self.check_next(['OPEN_PARENTHESIS_KEYWORD']):
            self.nextLexeme()
            operands.append(self.expression())
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')

        if self.evaluate_token(operators, operands):
            self.evaluate_expression(operators, operands)

    def evaluate_token(self, operators, operands):
        if self.literal():
            lit = self.lookahead
            self.nextLexeme()
            operands.append(evaluate.Literal(self.types[lit[0]], lit[1]))
            return True
        elif self.variable():
            name = self.lookahead
            pos = None
            self.nextLexeme()
            if self.check_next(['OPEN_BRACKET_KEYWORD']):
                self.nextLexeme()
                pos = self.expression()
                self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
            if self.check_next(['EQUAL_SIGN_KEYWORD']):
                return self.assignment(name, None)
            elif self.check_next(['INCREMENT_KEYWORD']):
                self.nextLexeme()
                operands.append(evaluate.Increment(self.variables, name[1]))
                return True
            elif self.check_next(['DECREMENT_KEYWORD']):
                self.nextLexeme()
                operands.append(evaluate.Decrement(self.variables, name[1]))
                return True
            elif self.check_next(['OPEN_PARENTHESIS_KEYWORD']):
                self.nextLexeme()
                while not self.check_next(['CLOSE_PARENTHESIS_KEYWORD']):
                    self.expression()
                    if not self.check_next(['CLOSE_PARENTHESIS_KEYWORD', 'SEMICOLON_KEYWORD']):
                        self.assert_next('COMMA_KEYWORD', 'expected comma')
                    if self.check_next(['SEMICOLON_KEYWORD', 'eof']):
                        print('expected ) before ' + self.lookahead[1])
                        return False
                self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            operands.append(evaluate.Variable(self.variables, name[1], pos))
            return True
        # elif self.check_next(['MINUS_KEYWORD']):
        #     self.nextLexeme()
        #     expr = self.expression()
        #     operands.append(evaluate.Negation(expr))
        #     return True
        elif self.check_next(['LEN_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
            expr = self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            operands.append(evaluate.Len(expr))
            return True
        elif self.check_next(['RAND_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
            expr1 = self.expression()
            self.assert_next('COMMA_KEYWORD', 'expected ,')
            expr2 = self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            operands.append(evaluate.Random(expr1, expr2))
            return True
        elif self.check_next(['READ_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected ()')
            name = self.lookahead[1]
            self.assert_next('IDENTIFIER', 'expected variable identifier')
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            operands.append(evaluate.Read(self.variables, name))
            return True
        elif self.check_next(['READLINE_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected ()')
            name = self.lookahead[1]
            self.assert_next('IDENTIFIER', 'expected variable identifier')
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            operands.append(evaluate.ReadLine(self.variables, name))
            return True
        elif self.check_next(['SQRT_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected ()')
            expr = self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            operands.append(evaluate.Sqrt(expr))
            return True
        elif self.check_next(['NOT_KEYWORD']):
            self.nextLexeme()
            expr = self.expression()
            operands.append(evaluate.Not(expr))
            return True
        elif self.check_next(['INT_KEYWORD']):
            self.nextLexeme()
            self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
            expr = self.expression()
            self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
            operands.append(evaluate.IntegerCast(expr))
            return True
        elif self.check_next(['PLUS_KEYWORD', 'MINUS_KEYWORD', 'MULTIPLY_KEYWORD', 'DIVIDE_KEYWORD', 'MODULO_KEYWORD']):
            self.append_math_operator(operators, operands)
            return True
        elif self.check_next(['GREATER_THAN_KEYWORD', 'LESS_THAN_KEYWORD', 'GREATER_THAN_OR_EQUALS_KEYWORD',
                              'LESS_THAN_OR_EQUALS_KEYWORD', 'AND_KEYWORD', 'OR_KEYWORD', 'EQUALS_KEYWORD',
                              'NOT_EQUALS_KEYWORD']):
            # operators.append(self.lookahead)
            # self.nextLexeme()
            # operands.append(self.expression())
            self.append_boolean_operator(operators, operands)
            return True
        else:
            return False

    def append_boolean_operator(self, operators, operands):
        operator = self.lookahead
        self.nextLexeme()

        while operators and operators[0][0] in ['PLUS_KEYWORD', 'MINUS_KEYWORD', 'MULTIPLY_KEYWORD', 'DIVIDE_KEYWORD', 'MODULO_KEYWORD']:
            op = operators.pop()
            if op[0] == 'MINUS_KEYWORD':
                if len(operands) % 2 != 0:
                    t1 = operands.pop()
                    operands.append(evaluate.Negation(t1))
                else:
                    if len(operands) < 2:
                        raise evaluate.EvaluationError('Invalid expression at ' + operator[1])
                    else:
                        t2 = operands.pop()
                        t1 = operands.pop()
                        operands.append(evaluate.MathOperation(op, t1, t2))

        operators.append(operator)
        operands.append(self.expression())

    def append_math_operator(self, operators, operands):
        operator = self.lookahead
        self.nextLexeme()

        if operators:
            while self.check_precedence(operators[0], operator):
                op = operators.pop()
                if op[0] == 'MINUS_KEYWORD':
                    if len(operands) % 2 != 0:
                        t1 = operands.pop()
                        operands.append(evaluate.Negation(t1))
                    else:
                        if len(operands) < 2:
                            raise evaluate.EvaluationError('Invalid expression at ' + operator[1])
                        else:
                            t2 = operands.pop()
                            t1 = operands.pop()
                            operands.append(evaluate.MathOperation(op, t1, t2))
                else:
                    if len(operands) < 2:
                        raise evaluate.EvaluationError('Invalid expression at ' + operator[1])
                    else:
                        t2 = operands.pop()
                        t1 = operands.pop()
                        operands.append(evaluate.MathOperation(op, t1, t2))
        operators.append(operator)

    def check_precedence(self, op1, op2):
        # if op1[0] in ['GREATER_THAN_KEYWORD', 'LESS_THAN_KEYWORD', 'GREATER_THAN_OR_EQUALS_KEYWORD',
        #                       'LESS_THAN_OR_EQUALS_KEYWORD', 'AND_KEYWORD', 'OR_KEYWORD', 'EQUALS_KEYWORD',
        #                       'NOT_EQUALS_KEYWORD']:
        #     return True
        if op1[0] in ['MULTIPLY_KEYWORD', 'DIVIDE_KEYWORD', 'MODULO_KEYWORD'] and op2 in ['PLUS_KEYWORD', 'MINUS_KEYWORD']:
            return True
        else:
            return False

    # def expression(self):
    #     return self.operation()
    #
    # def operation(self):
    #     trm = self.term()
    #     if trm:
    #         oprtr = self.operator()
    #         if oprtr:
    #             self.nextLexeme()
    #             oprtn = self.operation()
    #             if oprtn:
    #                 if oprtr in ['GREATER_THAN_KEYWORD',
    #                     'LESS_THAN_KEYWORD', 'GREATER_THAN_OR_EQUALS_KEYWORD',
    #                     'LESS_THAN_OR_EQUALS_KEYWORD', 'AND_KEYWORD',
    #                     'OR_KEYWORD', 'EQUALS_KEYWORD', 'NOT_EQUALS_KEYWORD']:
    #                     return evaluate.BooleanExpression(oprtr, trm, oprtn)
    #                 else:
    #                     return evaluate.MathExpression(oprtr, oprtn, trm)
    #             else:
    #                 return False
    #         else:
    #             return trm
    #     else:
    #         print('expected expression at ' + self.lookahead[1])
    #         return False
    #
    # def term(self):
    #     op = self.operand()
    #     if op:
    #         oprtr = self.operator()
    #         if oprtr:
    #             self.nextLexeme()
    #             trm = self.term()
    #             if trm:
    #                 if oprtr in ['GREATER_THAN_KEYWORD',
    #                     'LESS_THAN_KEYWORD', 'GREATER_THAN_OR_EQUALS_KEYWORD',
    #                     'LESS_THAN_OR_EQUALS_KEYWORD', 'AND_KEYWORD',
    #                     'OR_KEYWORD', 'EQUALS_KEYWORD', 'NOT_EQUALS_KEYWORD']:
    #                     return evaluate.BooleanExpression(oprtr, op, trm)
    #                 else:
    #                     return evaluate.MathExpression(oprtr, trm, op)
    #             else:
    #                 return False
    #         else:
    #             return op
    #     else:
    #         return False
    #
    #
    # def operand(self):
    #     if self.check_next(['OPEN_PARENTHESIS_KEYWORD']):
    #         self.nextLexeme()
    #         expr = self.expression()
    #         self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #         return expr
    #     else:
    #         if self.literal():
    #             lit = self.lookahead
    #             self.nextLexeme()
    #             return evaluate.Literal(self.types[lit[0]], lit[1])
    #         elif self.variable():
    #             name = self.lookahead
    #             pos = None
    #             self.nextLexeme()
    #             if self.check_next(['OPEN_BRACKET_KEYWORD']):
    #                 self.nextLexeme()
    #                 pos = self.expression()
    #                 self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
    #             if self.check_next(['EQUAL_SIGN_KEYWORD']):
    #                 return self.assignment(name)
    #             elif self.check_next(['INCREMENT_KEYWORD']):
    #                 self.nextLexeme()
    #                 return evaluate.Increment(self.variables, name[1])
    #             elif self.check_next(['DECREMENT_KEYWORD']):
    #                 self.nextLexeme()
    #                 return evaluate.Decrement(self.variables, name[1])
    #             elif self.check_next(['OPEN_PARENTHESIS_KEYWORD']):
    #                 self.nextLexeme()
    #                 while not self.check_next(['CLOSE_PARENTHESIS_KEYWORD']):
    #                     self.expression()
    #                     if not self.check_next(['CLOSE_PARENTHESIS_KEYWORD', 'SEMICOLON_KEYWORD']):
    #                         self.assert_next('COMMA_KEYWORD', 'expected comma')
    #                     if self.check_next(['SEMICOLON_KEYWORD', 'eof']):
    #                         print('expected ) before ' + self.lookahead[1])
    #                         return False
    #                 self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             return evaluate.Variable(self.variables, name[1], pos)
    #         elif self.check_next(['MINUS_KEYWORD']):
    #             self.nextLexeme()
    #             expr = self.expression()
    #             return evaluate.Negation(expr)
    #         elif self.check_next(['LEN_KEYWORD']):
    #             self.nextLexeme()
    #             self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
    #             # if self.check_next(['STRING_LITERAL']):
    #             #     self.nextLexeme()
    #             #     self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             # elif self.check_next(['INTEGER_LITERAL']):
    #             #     self.nextLexeme()
    #             #     self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             # elif self.check_next(['FLOAT_LITERAL']):
    #             #     self.nextLexeme()
    #             #     self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             # elif self.check_next(['IDENTIFIER']):
    #             #     self.nextLexeme()
    #             #     if self.check_next(['OPEN_BRACKET_KEYWORD']):
    #             #         self.nextLexeme()
    #             #         self.expression()
    #             #         self.assert_next('CLOSE_BRACKET_KEYWORD', 'expected ]')
    #             expr = self.expression()
    #             self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             return evaluate.Len(expr)
    #         elif self.check_next(['RAND_KEYWORD']):
    #             self.nextLexeme()
    #             self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected (')
    #             expr1 = self.expression()
    #             self.assert_next('COMMA_KEYWORD', 'expected ,')
    #             expr2 = self.expression()
    #             self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             return evaluate.Random(expr1, expr2)
    #         elif self.check_next(['READ_KEYWORD']):
    #             self.nextLexeme()
    #             self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected ()')
    #             name = self.lookahead[1]
    #             self.assert_next('IDENTIFIER', 'expected variable identifier')
    #             self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             return evaluate.Read(self.variables, name)
    #         elif self.check_next(['READLINE_KEYWORD']):
    #             self.nextLexeme()
    #             self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected ()')
    #             name = self.lookahead[1]
    #             self.assert_next('IDENTIFIER', 'expected variable identifier')
    #             self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             return evaluate.ReadLine(self.variables, name)
    #         elif self.check_next(['SQRT_KEYWORD']):
    #             self.nextLexeme()
    #             self.assert_next('OPEN_PARENTHESIS_KEYWORD', 'expected ()')
    #             expr = self.expression()
    #             self.assert_next('CLOSE_PARENTHESIS_KEYWORD', 'expected )')
    #             return evaluate.Sqrt(expr)
    #         elif self.check_next(['NOT_KEYWORD']):
    #             self.nextLexeme()
    #             expr = self.expression()
    #             return evaluate.Not(expr)
    #         else:
    #             return False

    def operator(self):
        if self.check_next(['PLUS_KEYWORD', 'MINUS_KEYWORD',
                                'MULTIPLY_KEYWORD', 'DIVIDE_KEYWORD',
                                'MODULO_KEYWORD', 'GREATER_THAN_KEYWORD',
                                'LESS_THAN_KEYWORD', 'GREATER_THAN_OR_EQUALS_KEYWORD',
                                'LESS_THAN_OR_EQUALS_KEYWORD', 'AND_KEYWORD',
                                'OR_KEYWORD', 'EQUALS_KEYWORD', 'NOT_EQUALS_KEYWORD'
                                ]):
            return self.lookahead[0]
        else:
            return False

    def literal(self):
        return self.check_next(['INTEGER_LITERAL', 'FLOAT_LITERAL', 'STRING_LITERAL', 'TRUE_KEYWORD', 'FALSE_KEYWORD'])

    def variable(self):
        return self.check_next(['IDENTIFIER'])
