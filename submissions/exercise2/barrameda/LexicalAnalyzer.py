import string

class State():
	def __init__(self, next):
		self.transitions = {}
		
		for entry in next.keys():
			self.transitions[entry] = next.get(entry)
			
class DFA():
	def __init__(self, s, tf, ss):
		self.states = s
		self.transitionFunction = tf
		self.startState = ss
		return
		
	def transition(self, inp):
		if inp not in self.transitionFunction:
			return False
		else:
			self.current = self.transitionFunction[inp]
			return True
	
	def run(self, inputList):
		self.current = self.startState
		for inp in inputList:
			action = (self.current, inp)
			if not self.transition(action):
				return False
		return True
		
def initDFA():
	DFAs = []
	#Variable Declaration keyword
	states = {0, 1, 2, 3}
	tf = dict()
	tf[(0, 'n')] = 1
	tf[(1, 'e')] = 2
	tf[(2, 'w')] = 3
	DFAs.append(DFA(states, tf, 0))
	
	#Variable Identifier
	states = {0, 1, 2}
	tf = dict()
	tf[(0, '$')] = 1
	tf[(0, '!')] = 1
	tf[(0, '@')] = 1
	tf[(0, '~')] = 1
	for s in string.ascii_lowercase:
		tf[(1, s)] = 2
	for s in string.ascii_uppercase:
		tf[(1, s)] = 2
	for x in range(10):
		tf[(1, str(x))] = 2
	DFAs.append(DFA(states, tf, 0))
	return DFAs

def tokenizer(str):
	tokens = []
	DFAs = initDFA()
	print(len(DFAs))
	print(DFAs[1].run(list('new')))
	
	
	return tokens
