import string

class DFA:

    keywords = [
        'def',
        'input',
        'output',
        'break',
        'continue',
        'if',
        'elsif',
        'else',
        'switch',
        'case',
        'default',
        'while',
        'do',
        'for',
        'foreach',
        'in',
        'function',
        'return',
        'true',
        'false'
    ]
        
    def __init__(self, transition_functions, start_state, accept_states):
        self.transition_functions = transition_functions
        self.accept_states = accept_states
        self.start_state = start_state
        self.state_count = 0 + len(accept_states)
        self.token = ''
        
    def create_keyword(self, keyword, name):
        current_state = self.start_state
        for i in range(len(keyword)):
            if (current_state, keyword[i]) in self.transition_functions.keys():
                current_state = self.transition_functions[(current_state, keyword[i])]
            else:
                self.state_count += 1
                self.transition_functions[(current_state, keyword[i])] = current_state = self.state_count
        self.accept_states[self.state_count] = name.upper() + '_KEYWORD'
    
    def tokenize(self, input):
        result = []
        current_state = self.start_state
        for i in range(len(input)):
            if (current_state, input[i]) in self.transition_functions.keys():
                temp = self.transition_functions[(current_state, input[i])]
                self.token = self.token + input[i]
                current_state = temp
            if i+1 < len(input):
                if current_state in self.accept_states.keys() and (current_state, input[i+1]) not in self.transition_functions.keys():
                    #result.append((self.accept_states[current_state], self.token))
                    res = self.accept_states[current_state]
                    if res == 'IDENTIFIER':
                        if self.token in self.keywords:
                            result.append((self.token.upper() + '_KEYWORD', self.token));
                    else:
                        result.append((self.accept_states[current_state], self.token))
                    self.token = ''
                    current_state = self.start_state
                    continue
            elif current_state in self.accept_states.keys():
                #result.append((self.accept_states[current_state], self.token))
                res = self.accept_states[current_state]
                if res == 'IDENTIFIER':
                    if self.token in self.keywords:
                        result.append((self.token.upper() + '_KEYWORD', self.token));
                else:
                    result.append((self.accept_states[current_state], self.token))
                self.token = ''
            else:
                result.append(('UNKNOWN_TOKEN', self.token))
                self.token = ''
        return result

def create_DFA():
    dfa = DFA({}, 0, {})
    
    # add dfa for keywords
    dfa.create_keyword('def', 'identifier')
    dfa.create_keyword('input', 'input')
    dfa.create_keyword('output', 'output')
    dfa.create_keyword('break', 'break')
    dfa.create_keyword('continue', 'continue')
    dfa.create_keyword('if', 'if')
    dfa.create_keyword('elsif', 'else_if')
    dfa.create_keyword('else', 'else')
    dfa.create_keyword('switch', 'switch')
    dfa.create_keyword('case', 'case')
    dfa.create_keyword('default', 'default')
    dfa.create_keyword('while', 'while')
    dfa.create_keyword('do', 'do')
    dfa.create_keyword('for', 'for')
    dfa.create_keyword('foreach', 'foreach')
    dfa.create_keyword('in', 'in')
    dfa.create_keyword('function', 'function')
    dfa.create_keyword('return', 'return')
    dfa.create_keyword('true', 'true')
    dfa.create_keyword('false', 'false')
    
    # add dfa for symbols
    dfa.create_keyword('(', 'open_parenthesis')
    dfa.create_keyword(')', 'close_parenthesis')
    dfa.create_keyword('[', 'open_bracket')
    dfa.create_keyword(']', 'close_bracket')
    dfa.create_keyword('{', 'open_curly_brace')
    dfa.create_keyword('}', 'close_curly_brace')
    dfa.create_keyword(';', 'semicolon')
    dfa.create_keyword(',', 'comma')
    dfa.create_keyword('?', 'question_mark')
    dfa.create_keyword(':', 'colon')
    dfa.create_keyword('+', 'plus')
    dfa.create_keyword('-', 'minus')
    dfa.create_keyword('*', 'multiply')
    dfa.create_keyword('/', 'divide')
    dfa.create_keyword('%', 'modulo')
    dfa.create_keyword('=', 'equal_sign')
    dfa.create_keyword('&&', 'and')
    dfa.create_keyword('||', 'or')
    dfa.create_keyword('!', 'not')
    dfa.create_keyword('==', 'equals')
    dfa.create_keyword('!=', 'not_equals')
    dfa.create_keyword('>', 'greater_than')
    dfa.create_keyword('<', 'less_than')
    dfa.create_keyword('>=', 'greater_than_or_equals')
    dfa.create_keyword('<=', 'less_than_or_equals')
    dfa.create_keyword('++', 'increment')
    dfa.create_keyword('--', 'decrement')
    
    # add dfa for number literals
    current_state = dfa.start_state
    dfa.state_count += 1
    for c in string.digits:
        dfa.transition_functions[(current_state, c)] = dfa.state_count
        dfa.transition_functions[(dfa.start_state, c)] = dfa.state_count
        dfa.transition_functions[(dfa.state_count, c)] = dfa.state_count
    dfa.accept_states[dfa.state_count] = 'INTEGER_LITERAL'
    current_state = dfa.state_count
    dfa.state_count += 1
    dfa.transition_functions[(current_state, '.')] = dfa.state_count
    dfa.transition_functions[(dfa.start_state, '.')] = dfa.state_count
    current_state = dfa.state_count
    dfa.state_count += 1
    for c in string.digits:
        dfa.transition_functions[(current_state, c)] = dfa.state_count
        dfa.transition_functions[(dfa.state_count, c)] = dfa.state_count
    dfa.accept_states[dfa.state_count] = 'FLOAT_LITERAL'
    
    # add dfa for string literals
    current_state = dfa.start_state
    dfa.state_count += 1
    dfa.transition_functions[(current_state, '"')] = dfa.state_count
    current_state = dfa.state_count
    dfa.state_count += 1
    for c in string.printable:
        dfa.transition_functions[(current_state, c)] = dfa.state_count
        dfa.transition_functions[(dfa.state_count, c)] = dfa.state_count
    current_state = dfa.state_count
    dfa.state_count += 1
    dfa.transition_functions[(current_state, '"')] = dfa.state_count
    dfa.accept_states[dfa.state_count] = 'STRING_LITERAL';
    
    # add dfa for single line comment
    current_state = dfa.start_state
    dfa.state_count += 1
    dfa.transition_functions[(current_state, '@')] = dfa.state_count
    current_state = dfa.state_count
    dfa.state_count += 1
    for c in string.printable:
        dfa.transition_functions[(current_state, c)] = dfa.state_count
        dfa.transition_functions[(dfa.state_count, c)] = dfa.state_count
    current_state = dfa.state_count
    dfa.state_count += 1
    dfa.transition_functions[(current_state, '\n')] = dfa.state_count
    dfa.accept_states[dfa.state_count] = 'SINGLE-LINE COMMENT'
    
    # add dfa for identifiers
    current_state = dfa.start_state
    dfa.state_count += 1
    for c in string.ascii_letters:
        dfa.transition_functions[(current_state, c)] = dfa.state_count
    current_state = dfa.state_count
    dfa.state_count += 1
    for c in string.ascii_letters:
        dfa.transition_functions[(current_state, c)] = dfa.state_count
        dfa.transition_functions[(dfa.state_count, c)] = dfa.state_count
    for c in string.digits:
        dfa.transition_functions[(current_state, c)] = dfa.state_count
        dfa.transition_functions[(dfa.state_count, c)] = dfa.state_count
    dfa.transition_functions[(current_state, '_')] = dfa.state_count
    dfa.transition_functions[(dfa.state_count, '_')] = dfa.state_count
    dfa.accept_states[dfa.state_count] = 'IDENTIFIER'

    return dfa

dfa = create_DFA()
code = open('sample.ric', 'r').read().strip()
lexemes = dfa.tokenize(code)
print(lexemes)
