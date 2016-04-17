import LexicalAnalyzer
import SyntaxAnalyzer

#code = open('sample1.scb', 'r')
#tokens = LexicalAnalyzer.tokenizer(code.read())

#SyntaxAnalyzer.parser(tokens)

#code = open('sample2.scb', 'r')
#tokens = LexicalAnalyzer.tokenizer(code.read())

#SyntaxAnalyzer.parser(tokens)

code = open('sample3.scb', 'r')
tokens = LexicalAnalyzer.tokenizer(code.read())

SyntaxAnalyzer.parser(tokens)
print('\n')
