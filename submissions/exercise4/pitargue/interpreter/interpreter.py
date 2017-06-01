class Interpreter:

    def __init__(self, parse_tree, variables):
        self.parse_tree = parse_tree
        self.variables = variables

    def interpret(self):
        for stmt in self.parse_tree:
            stmt.evaluate()
