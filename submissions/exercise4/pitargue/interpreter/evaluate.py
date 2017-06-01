from random import randint
import math

types = {
    'TRUE_KEYWORD': 'boolean',
    'FALSE_KEYWORD': 'boolean',
    'INTEGER_LITERAL': 'int',
    'FLOAT_LITERAL': 'float',
    'STRING_LITERAL': 'string'
}

class EvaluationError(Exception):
    pass

class Variable:
    def __init__(self, variables, name, pos):
        self.name = name
        self.variables = variables
        self.pos = pos

    def evaluate(self):
        if self.name in self.variables:
            if self.pos is not None:
                pos = self.pos.evaluate()

                if not self.variables[self.name]['type'] == 'array':
                    raise EvaluationError(self.name + ' is not an array')
                elif (len(self.variables[self.name]['value'])-1) < pos[1]:
                    raise EvaluationError('index out of range')

                value = self.variables[self.name]['value'][pos[1]][1]
                if self.variables[self.name]['value'][pos[1]][0] == 'string':
                    value = value.strip('"')
                elif self.variables[self.name]['value'][pos[1]][0] == 'int':
                    value = int(value)
                elif self.variables[self.name]['value'][pos[1]][0] == 'float':
                    value = float(value)
                elif self.variables[self.name]['value'][pos[1]][0] == 'boolean':
                    value = bool(value)
                elif self.variables[self.name]['value'][pos[1]][0] == 'array':
                    b = []
                    for v in value:
                        b.append(v[1])
                    value = b
                return (self.variables[self.name]['value'][pos[1]][0], value)

            else:
                value = self.variables[self.name]['value']
                if self.variables[self.name]['type'] == 'string':
                    value = value.strip('"')
                elif self.variables[self.name]['type'] == 'int':
                    value = int(value)
                elif self.variables[self.name]['type'] == 'float':
                    value = float(value)
                elif self.variables[self.name]['type'] == 'boolean':
                    value = bool(value)
                elif self.variables[self.name]['type'] == 'array':
                    b = []
                    for v in value:
                        b.append(v[1])
                    value = b
                return (self.variables[self.name]['type'], value)
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')
class IntegerCast:
    def __init__(self, expr):
        self.expr = expr;

    def evaluate(self):
        e = self.expr.evaluate()
        return ('int', int(e[1]))

class Append:
    def __init__(self, variables, name, expr):
        self.variables = variables
        self.name = name
        self.expr = expr

    def evaluate(self):
        if self.name in self.variables:
            expr = self.expr.evaluate()
            if self.variables[self.name]['type'] == 'array':
                self.variables[self.name]['value'].append(expr)
            else:
                raise EvaluationError(self.name + ' is not an array')
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class Literal:
    def __init__(self, type, literal):
        self.type = type
        self.literal = literal

    def evaluate(self):
        value = self.literal
        if self.type == 'int':
            value = int(value)
        elif self.type == 'float':
            value = float(value)
        elif self.type == 'boolean':
            value = value == 'true'
        else:
            value = value.strip('"')
        return (self.type, value)

class Len:
    def __init__(self, expr):
        self.expr = expr

    def evaluate(self):
        value = self.expr.evaluate()
        len_val = None
        if value[0] == 'boolean':
            raise EvaluationError('Bad operand type for len: ' + value[0])
        elif value[0] in ['int', 'float']:
            len_val = len(str(value[1]))
        else:
            len_val = len(value[1])
        return ('int', len_val)

class VarDec:
    def __init__(self, variables, name, expr=None):
        self.variables = variables
        self.name = name
        self.expr = expr

    def evaluate(self):
        if self.expr is not None:
            value = self.expr.evaluate()
            self.variables[self.name]['type'] = value[0]
            self.variables[self.name]['value'] = value[1]
        else:
            self.variables[self.name]['type'] = 'undefined'
            self.variables[self.name]['value'] = None

class Assignment:
    def __init__(self, variables, name, pos, expr):
        self.variables = variables
        self.name = name
        self.expr = expr
        self.pos = pos

    def evaluate(self):
        if self.name in self.variables:
            if self.pos is not None:
                pos = self.pos.evaluate()
                if(self.expr[0] == 'single'):
                    value = self.expr[1].evaluate()
                    self.variables[self.name]['value'][pos[1]] = (value[0], value[1])
                    return (value[0], value[1])
                elif(self.expr[0] == 'array'):
                    arr = []
                    for ex in self.expr[1]:
                        arr.append(ex.evaluate())
                    self.variables[self.name]['value'][pos[1]] = ('array', arr)
                    return('array', arr)
            else:
                if(self.expr[0] == 'single'):
                    value = self.expr[1].evaluate()
                    self.variables[self.name]['type'] = value[0]
                    self.variables[self.name]['value'] = value[1]
                    return (value[0], value[1])
                elif(self.expr[0] == 'array'):
                    self.variables[self.name]['type'] = 'array'
                    arr = []
                    for ex in self.expr[1]:
                        arr.append(ex.evaluate())
                    self.variables[self.name]['value'] = arr
                    return('array', arr)
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class Increment:
    def __init__(self, variables, name):
        self.variables = variables
        self.name = name

    def evaluate(self):
        if self.name in self.variables:
            value = self.variables[self.name]['value']
            if self.variables[self.name]['type'] in ['int', 'float']:
                self.variables[self.name]['value'] = value + 1
                return (self.variables[self.name]['type'], self.variables[self.name]['value'])
            else:
                raise EvaluationError('Bad operand type for increment: ' + self.variables[self.name]['type'])
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class Decrement:
    def __init__(self, variables, name):
        self.variables = variables
        self.name = name

    def evaluate(self):
        if self.name in self.variables:
            value = self.variables[self.name]['value']
            if self.variables[self.name]['type'] in ['int', 'float']:
                self.variables[self.name]['value'] = value - 1
                return (self.variables[self.name]['type'], self.variables[self.name]['value'])
            else:
                raise EvaluationError('Bad operand type for decrement: ' + self.variables[self.name]['type'])
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class Negation:
    def __init__(self, expr):
        self.expr = expr

    def evaluate(self):
        value = self.expr.evaluate()
        if value[0] in ['int', 'float']:
            return (value[0], -value[1])
        else:
            raise EvaluationError('Bad operand type for negation: ' + value[0])

class Random:
    def __init__(self, expr1, expr2):
        self.expr1 = expr1
        self.expr2 = expr2

    def evaluate(self):
        val1 = self.expr1.evaluate()
        val2 = self.expr2.evaluate()

        if val1[0] in ['boolean', 'float', 'string']:
            raise EvaluationError('Bad operand type for rand: ' + val1[0])

        if val2[0] in ['boolean', 'float', 'string']:
            raise EvaluationError('Bad operand type for rand: ' + val2[2])

        if val1[1] > val2[1]:
            raise EvaluationError('Invalid range for rand: [' + str(val1[1]) + ',' + str(val2[1]) + ']')

        return ('int', randint(val1[1], val2[1]))

class Sqrt:
    def __init__(self, expr):
        self.expr = expr

    def evaluate(self):
        value = self.expr.evaluate()

        if value[0] in ['string', 'boolean']:
            raise EvaluationError('Bad operand type for sqrt: ' + value[0])

        return ('float', math.sqrt(value[1]))

class Not:
    def __init__(self, expr):
        self.expr = expr

    def evaluate(self):
        value = self.expr.evaluate()
        return ('boolean', bool(value[1]))

class Output:
    def __init__(self, expr):
        self.expr = expr

    def evaluate(self):
        val = self.expr.evaluate()
        print(val[1])

class Input:
    def __init__(self, variables, name, message):
        self.variables = variables
        self.name = name
        self.message = message
    def evaluate(self):
        if self.name in self.variables:
            if self.message is not None:
                print(self.message.strip('"'), end='')

            val = input()
            try:
                val = int(val)
                t = 'int'
            except:
                try:
                    val = float(val)
                    t = 'float'
                except:
                    t = 'string'

            self.variables[self.name]['type'] = t
            self.variables[self.name]['value'] = val
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class IfThenElse:
    def __init__(self, cond, then, elsif_cond, elsif_block, else_block):
        self.cond = cond
        self.then = then
        self.elsif_cond = elsif_cond
        self.elsif_block = elsif_block
        self.else_block = else_block

    def evaluate(self):
        val = self.cond.evaluate()

        # print(self.else_block)

        if bool(val[1]):
            for stmt in self.then:
                stmt.evaluate()
        else:
            if self.elsif_cond is not None:
                val2 = self.elsif_cond.evaluate()
                if bool(val2[1]):
                    for stmt in self.elsif_block:
                        stmt.evaluate()
            elif self.else_block is not None:
                for stmt in self.else_block:
                    stmt.evaluate()

class WhileLoop:
    def __init__(self, cond, loop):
        self.cond = cond
        self.loop = loop

    def evaluate(self):
        res = None
        shouldBreak = False
        while bool(self.cond.evaluate()[1]) and not shouldBreak:
            for stmt in self.loop:
                res = stmt.evaluate()
                if res == 'break':
                    shouldBreak = True
                    break
                elif res == 'continue':
                    break

class ForLoop:
    def __init__(self, init, cond, loop, last):
        self.init = init
        self.cond = cond
        self.loop = loop
        self.last = last

    def evaluate(self):
        if isinstance(self.init, list):
            for stmt in self.init:
                stmt.evaluate()
        else:
            self.init.evaluate()

        if self.loop is None:
            return

        loop = list(self.loop)

        res = None
        shouldBreak = False
        while bool(self.cond.evaluate()[1]) and not shouldBreak:
            for stmt in loop:
                res = stmt.evaluate()
                if res == 'break':
                    shouldBreak = True
                    break
                elif res == 'continue':
                    break
            self.last.evaluate()

class DoWhileLoop:
    def __init__(self, loop, cond):
        self.loop = loop;
        self.cond = cond;

    def evaluate(self):
        for stmt in self.loop:
            stmt.evaluate()
        res = None
        shouldBreak = False
        while bool(self.cond.evaluate()[1]) and not shouldBreak:
            for stmt in self.loop:
                res = stmt.evaluate()
                if res == 'break':
                    shouldBreak = True
                    break
                elif res == 'continue':
                    break

class Break:
    def evaluate(self):
        return 'break'

class Continue:
    def evaluate(self):
        return 'continue'

class Open:
    def __init__(self, path, mode, name, variables):
        self.path = path
        self.mode = mode
        self.name = name
        self.variables = variables

    def evaluate(self):
        if self.name in self.variables:
            if not isinstance(self.path, str):
                self.path = self.path.evaluate()[1]
            f = open(self.path.strip('"'), self.mode.strip('"'))
            self.variables[self.name]['type'] = 'file'
            self.variables[self.name]['value'] = (self.mode.strip('"'), f)
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class Write:
    def __init__(self, variables, name, value):
        self.variables = variables
        self.name = name
        self.value = value

    def evaluate(self):
        value = self.value
        if self.name in self.variables:
            mode = self.variables[self.name]['value'][0]
            f = self.variables[self.name]['value'][1]

            if mode not in ['w', 'rw', 'wr']:
                raise EvaluationError('File stored in variable "' + self.name + '" was not opened for writing.')

            if not isinstance(self.value, str):
                value = value.evaluate()[1]

            f.write(str(value).strip('"'))
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class WriteLine:
    def __init__(self, variables, name, value):
        self.variables = variables
        self.name = name
        self.value = value

    def evaluate(self):
        value = self.value
        if self.name in self.variables:
            mode = self.variables[self.name]['value'][0]
            f = self.variables[self.name]['value'][1]

            if mode not in ['w', 'rw', 'wr']:
                raise EvaluationError('File stored in variable "' + self.name + '" was not opened for writing.')

            if not isinstance(self.value, str):
                value = value.evaluate()[1]

            f.write(str(value).strip('"') + '\n')
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class ReadLine:
    def __init__(self, variables, name):
        self.variables = variables
        self.name = name

    def evaluate(self):
        if self.name in self.variables:
            f = self.variables[self.name]['value'][1]
            val = f.readline()
            if not val:
                raise EvaluationError('End of file was reached while reading line.')
            else:
                return ('string', val.rstrip())
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class Read:
    def __init__(self, variables, name):
        self.variables = variables
        self.name = name

    def evaluate(self):
        if self.name in self.variables:
            f = self.variables[self.name]['value'][1]
            return ('string', ''.join(f.readlines()))
        else:
            raise EvaluationError('Variable "' + self.name + '" was not declared.')

class Expression:
    def __init__(self, operators, operands):
        self.operators = operators
        self.operands = operands
        # print(operators)
        # print(operands)

    def evaluate(self):
        operators = list(self.operators)
        operands = list(self.operands)
        while operators:
            if operators[0][0] in ['GREATER_THAN_KEYWORD', 'LESS_THAN_KEYWORD', 'GREATER_THAN_OR_EQUALS_KEYWORD',
                                  'LESS_THAN_OR_EQUALS_KEYWORD', 'AND_KEYWORD', 'OR_KEYWORD', 'EQUALS_KEYWORD',
                                  'NOT_EQUALS_KEYWORD']:
                op = operators[0]
                operators = operators[1:]
                if len(operands) < 2:
                    raise EvaluationError('Invalid expression at ' + op[1])
                else:
                    t1 = operands[0]
                    t2 = operands[1]
                    operands = operands[2:]
                    operands.append(BooleanOperation(op, t1, t2))
            else:
                op = operators.pop()
                if op[0] == 'MINUS_KEYWORD':
                    if len(operands) % 2 != 0:
                        t1 = operands.pop()
                        operands.append(Negation(t1))
                    else:
                        if len(operands) < 2:
                            raise EvaluationError('Invalid expression at ' + op[1])
                        else:
                            t2 = operands.pop()
                            t1 = operands.pop()
                            operands.append(MathOperation(op, t1, t2))
                else:
                    if len(operands) < 2:
                        raise EvaluationError('Invalid expression at ' + op[1])
                    else:
                        t2 = operands.pop()
                        t1 = operands.pop()
                        operands.append(MathOperation(op, t1, t2))
        res = operands.pop()
        # print(res)
        # out = res.evaluate()
        # print(out)
        return res.evaluate()
        # return out

class BooleanOperation:
    def __init__(self, operator, expr1, expr2):
        self.operator = operator
        self.expr1 = expr1
        self.expr2 = expr2

    def evaluate(self):
        val1 = self.expr1.evaluate()
        val2 = self.expr2.evaluate()

        if self.operator[0] == 'GREATER_THAN_KEYWORD':
            if val1[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val1[0])
            if val2[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val2[0])
            return ('boolean', val1[1] > val2[1])
        elif self.operator[0] == 'LESS_THAN_KEYWORD':
            if val1[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val1[0])
            if val2[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val2[0])
            return ('boolean', val1[1] < val2[1])
        elif self.operator[0] == 'GREATER_THAN_OR_EQUALS_KEYWORD':
            if val1[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val1[0])
            if val2[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val2[0])
            return ('boolean', val1[1] >= val2[1])
        elif self.operator[0] == 'LESS_THAN_OR_EQUALS_KEYWORD':
            if val1[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val1[0])
            if val2[0] not in ['int', 'float']:
                raise EvaluationError('Bad operand type for boolean expression: ' + val2[0])
            return ('boolean', val1[1] <= val2[1])
        elif self.operator[0] == 'EQUALS_KEYWORD':
            return ('boolean', val1[1] == val2[1])
        elif self.operator[0] == 'AND_KEYWORD':
            return ('boolean', val1[1] and val2[1])
        else:
            return ('boolean', val1[1] or val2[1])

class MathOperation:
    def __init__(self, operation, expr1, expr2):
        self.operation = operation
        self.expr1 = expr1
        self.expr2 = expr2

    def evaluate(self):
        self.expr1 = self.expr1.evaluate()
        self.expr2 = self.expr2.evaluate()

        if self.expr1[0] in ['int', 'float']:
            if self.expr2[0] in ['int', 'float']:
                if self.operation[0] == 'PLUS_KEYWORD':
                    res = self.expr1[1] + self.expr2[1]
                elif self.operation[0] == 'MINUS_KEYWORD':
                    res = self.expr1[1] - self.expr2[1]
                elif self.operation[0] == 'MULTIPLY_KEYWORD':
                    res = self.expr1[1] * self.expr2[1]
                elif self.operation[0] == 'DIVIDE_KEYWORD':
                    res = self.expr1[1] / self.expr2[1]
                elif self.operation[0] == 'MODULO_KEYWORD':
                    res = self.expr1[1] % self.expr2[1]
                else:
                    raise EvaluationError('Unknown operation: ' + self.operation[1])

                if self.expr1[0] == 'float' or self.expr2[0] == 'float':
                    return ('float', res)
                else:
                    return ('int', res)
            else:
                raise EvaluationError('Bad operand: ' + self.expr2[0])
        else:
            raise EvaluationError('Bad operand: ' + self.expr1[0])
