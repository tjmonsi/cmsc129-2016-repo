import LexicalAnalyzer

code = open('input.txt', 'r')
tokens = LexicalAnalyzer.tokenizer(code.read())
print(tokens)
