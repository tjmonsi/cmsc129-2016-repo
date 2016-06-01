#!/usr/bin/python
import tokengenerator
import grammar
import execute

filename = input("Enter Filename: ")
tokengenerator.tokengenerator(filename)

print("\n\nCHECK GRAMMAR\n\n")

grammar.addGrammars()
ret = grammar.checkGrammar("START", 0)
if len(ret.grammar) >0:
    print("GRAMMAR CONSTRUCTION")
    for gram in ret.grammar:
        
        print(gram.grammar+"-> "+gram.token+"    "+str(gram.type))

if len(ret.error_messages) > 0:
    print("ERROR MESSAGES")
    for message in ret.error_messages:
        
        print(message)
print("\n\nCONSOLE INPUT")
execute.execute(ret.grammar)

