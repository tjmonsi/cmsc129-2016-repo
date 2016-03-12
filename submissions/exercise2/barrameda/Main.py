import LexicalAnalyzer

code = open('sample1.scb', 'r')
tokens = LexicalAnalyzer.tokenizer(code.read())

print("Tokens for Sample 1")
for s in tokens:
	print(s+", ", end="")
	
code = open('sample2.scb', 'r')
tokens = LexicalAnalyzer.tokenizer(code.read())

print("\n\nTokens for Sample 2")
for s in tokens:
	print(s+", ", end="")
	
code = open('sample3.scb', 'r')
tokens = LexicalAnalyzer.tokenizer(code.read())

print("\n\nTokens for Sample 3")
for s in tokens:
	print(s+", ", end="")
print('\n')
