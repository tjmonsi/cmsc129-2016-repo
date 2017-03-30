import string
from Lexeme import Lexeme

class DFA():
	Nstates = 0

	def __init__(self, tf, lx, ac,  ss):
		self.token = ""
		self.transitionFunction = tf
		self.lexemes = lx
		self.acceptStates = ac
		self.startState = ss
		return

	def reset(self):
		self.current = self.startState
		self.token = ""
		return

	def goalCheck(self):
		if self.current in self.acceptStates:
			return True
		else:
			return False

	def addBranch(self, b):
		self.acceptStates = self.acceptStates | b.acceptStates
		self.transitionFunction.update(b.transitionFunction)
		self.lexemes.update(b.lexemes)
		return

	def checkNext(self, c):
		if (self.current, c) in self.transitionFunction:
			return True
		else:
			return False

	def transition(self, inp):
		if (self.current, inp) not in self.transitionFunction:
			return False
		else:
			self.current = self.transitionFunction.get((self.current, inp))
			self.token = self.token + inp
			return True

def keywordTF(str, dfa):
	tf = dict()
	lexeme = dict()
	start = DFA.Nstates
	i = current = 0
	while(i<len(str)):
		if (current, str[i]) not in dfa.transitionFunction:
			tf[(current, str[i])] = DFA.Nstates+1
			DFA.Nstates+=1
			current = DFA.Nstates
		else:
			current = dfa.transitionFunction.get((current, str[i]))
		i += 1
	acceptState = {current}
	lexeme[current] = str
	return DFA(tf, lexeme, acceptState, start)

def initDFA():
	dfa = DFA({}, {}, set(), 0)
	#Keywords
	dfa.addBranch(keywordTF('new', dfa))
	dfa.addBranch(keywordTF('print', dfa))
	dfa.addBranch(keywordTF('scan', dfa))
	dfa.addBranch(keywordTF('concat', dfa))
	dfa.addBranch(keywordTF('splice', dfa))
	dfa.addBranch(keywordTF('len', dfa))
	dfa.addBranch(keywordTF('func', dfa))
	dfa.addBranch(keywordTF('return', dfa))
	dfa.addBranch(keywordTF('call', dfa))
	dfa.addBranch(keywordTF('if', dfa))
	dfa.addBranch(keywordTF('elsif', dfa))
	dfa.addBranch(keywordTF('else', dfa))
	dfa.addBranch(keywordTF('for', dfa))
	dfa.addBranch(keywordTF('while', dfa))
	dfa.addBranch(keywordTF('do', dfa))
	dfa.addBranch(keywordTF('not', dfa))
	dfa.addBranch(keywordTF('and', dfa))
	dfa.addBranch(keywordTF('or', dfa))
	dfa.addBranch(keywordTF('true', dfa))
	dfa.addBranch(keywordTF('false', dfa))
	dfa.addBranch(keywordTF('(', dfa))
	dfa.addBranch(keywordTF(')', dfa))
	dfa.addBranch(keywordTF('[', dfa))
	dfa.addBranch(keywordTF(']', dfa))
	dfa.addBranch(keywordTF('{', dfa))
	dfa.addBranch(keywordTF('}', dfa))
	dfa.addBranch(keywordTF(',', dfa))
	dfa.addBranch(keywordTF(';', dfa))
	dfa.addBranch(keywordTF('=', dfa))
	dfa.addBranch(keywordTF('+', dfa))
	dfa.addBranch(keywordTF('-', dfa))
	dfa.addBranch(keywordTF('/', dfa))
	dfa.addBranch(keywordTF('*', dfa))
	dfa.addBranch(keywordTF('%', dfa))
	dfa.addBranch(keywordTF('<', dfa))
	dfa.addBranch(keywordTF('>', dfa))
	dfa.addBranch(keywordTF('==', dfa))
	dfa.addBranch(keywordTF('<=', dfa))
	dfa.addBranch(keywordTF('>=', dfa))
	dfa.addBranch(keywordTF('//', dfa))
	dfa.addBranch(keywordTF('/*', dfa))
	dfa.addBranch(keywordTF('*/', dfa))
	dfa.addBranch(keywordTF('_i', dfa))

	#Variable Identifier
	tf = dict()
	lexeme = dict()
	DFA.Nstates += 1
	tf[(0, '$')] = DFA.Nstates
	tf[(0, '!')] = DFA.Nstates
	tf[(0, '@')] = DFA.Nstates
	tf[(0, '~')] = DFA.Nstates
	for s in string.ascii_letters:
		tf[(DFA.Nstates, s)] = DFA.Nstates+1
		tf[(DFA.Nstates+1, s)] = DFA.Nstates+1
	for x in range(10):
		tf[(DFA.Nstates, str(x))] = DFA.Nstates
		tf[(DFA.Nstates+1, str(x))] = DFA.Nstates+1
	DFA.Nstates += 1
	lexeme[DFA.Nstates] = 'Variable Identifier'
	dfa.addBranch(DFA(tf, lexeme, {DFA.Nstates}, 0))

	#Integer/Float Literal
	tf = dict()
	lexeme = dict()
	DFA.Nstates += 1
	for s in range(10):
		tf[(0, str(s))] = DFA.Nstates
		tf[(DFA.Nstates, str(s))] = DFA.Nstates
		tf[(dfa.transitionFunction.get(0, '-'), s)] = DFA.Nstates
	acceptStates = {DFA.Nstates}
	lexeme[DFA.Nstates] = 'Integer Literal'
	tf[DFA.Nstates, '.'] = DFA.Nstates+1
	DFA.Nstates += 1
	tf[(0, '.')] = DFA.Nstates
	tf[(dfa.transitionFunction.get(0, '-'), '.')] = DFA.Nstates
	for s in range(10):
		tf[(DFA.Nstates, str(s))] = DFA.Nstates+1
		tf[(DFA.Nstates+1, str(s))] = DFA.Nstates+1
	DFA.Nstates += 1
	acceptStates = acceptStates | {DFA.Nstates}
	lexeme[DFA.Nstates] = 'Float Literal'
	dfa.addBranch(DFA(tf, lexeme, acceptStates, 0))

	#String Literal
	tf = dict()
	lexeme = dict()
	DFA.Nstates += 1
	tf[(0, '"')] = DFA.Nstates
	for s in string.printable:
		tf[(DFA.Nstates, s)] = DFA.Nstates+1
		tf[(DFA.Nstates+1, s)] = DFA.Nstates+1
	DFA.Nstates += 1
	tf[(DFA.Nstates, '"')] = DFA.Nstates+1
	tf[(dfa.transitionFunction.get(0, '"'), '"')] = DFA.Nstates+1
	DFA.Nstates += 1
	lexeme[DFA.Nstates] = 'String Literal'
	dfa.addBranch(DFA(tf, lexeme, {DFA.Nstates}, 0))

	return dfa

def tokenizer(stream):
	tokens = []
	dfa = initDFA()

	dfa.reset()
	lineCount=1
	for line in stream.split('\n'):
		i=0
		while(i<len(line)):
			valid = dfa.transition(line[i])
			if not valid:
				dfa.reset()
			accept = dfa.goalCheck()
			if i+1<len(line):
				next = dfa.checkNext(line[i+1])
				if accept and not next:
					#tokens.append(dfa.token)
					tokens.append(Lexeme(dfa.token, dfa.lexemes.get(dfa.current), lineCount))
					dfa.reset()
			elif accept:
				#tokens.append(dfa.token)
				tokens.append(Lexeme(dfa.token, dfa.lexemes.get(dfa.current), lineCount))
				dfa.reset()
			i += 1
		lineCount += 1

	return tokens
