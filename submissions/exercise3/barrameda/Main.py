import LexicalAnalyzer
import SyntaxAnalyzer

code = open('sample1.scb', 'r')
tokens = LexicalAnalyzer.tokenizer(code.read())
print("Syntax Error for Sample 1")
SyntaxAnalyzer.parser(tokens)
print('\n')

#code = open('sample2.scb', 'r')
#tokens = LexicalAnalyzer.tokenizer(code.read())
#print("Syntax Error for Sample 2")
#SyntaxAnalyzer.parser(tokens)
#print('\n')

#code = open('sample3.scb', 'r')
#tokens = LexicalAnalyzer.tokenizer(code.read())
#print("Syntax Error for Sample 3")
#SyntaxAnalyzer.parser(tokens)
#print('\n')

#code = open('sample4.scb', 'r')
#tokens = LexicalAnalyzer.tokenizer(code.read())
#print("Syntax Error for Sample 4")
#SyntaxAnalyzer.parser(tokens)
#print('\n')

#code = open('sample5.scb', 'r')
#tokens = LexicalAnalyzer.tokenizer(code.read())
#print("Syntax Error for Sample 5")
#SyntaxAnalyzer.parser(tokens)
#print('\n')

#code = open('sample6.scb', 'r')
#tokens = LexicalAnalyzer.tokenizer(code.read())
#print("Syntax Error for Sample 6")
#SyntaxAnalyzer.parser(tokens)
#print('\n')
