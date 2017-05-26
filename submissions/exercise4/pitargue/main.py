import sys

from interpreter import lexical_analyzer, syntax_analyzer, interpreter

def main(argv):

    if len(argv) == 0:
        print('ERROR: No input file.')
        print('For more information on how to use the interpreter, you may '\
              'pass --help as a paremeter.')
        return

    if len(argv) == 1 and argv[0] == '--help':
        print('Print help here')
        return

    dfa = lexical_analyzer.create_DFA()
    code = open(argv[0], 'r').read().strip()
    lexemes = dfa.tokenize(code)
    # print(lexemes)
    parser = syntax_analyzer.Parser({})
    parse_tree = parser.parse(lexemes)
    # print(parse_tree)
    variables = parser.variables
    intr = interpreter.Interpreter(parse_tree, variables)
    intr.interpret()
    # print(variables)
    for var in variables:
        if variables[var]['type'] == 'file':
            variables[var]['value'][1].close()

if __name__ == '__main__':
    main(sys.argv[1:])
