import string

#	Simple class-based abstraction of a "universal" DFA
class DFA:
	
	current_state = None
	
	def __init__(self, states, transitions, start_state, accept_states):
		self.states = states
		self.transitions = transitions
		self.start_state = start_state
		self.accept_states = accept_states
		self.token = ''
		
	def append(self, state):
		self.states.extend(state.states)
		self.transitions.update(state.transitions)
		self.accept_states.update(state.accept_states)
		
	def accept(self):
		return self.current_state in self.accept_states
		
	def next_state(self, input):
		self.current_state = self.transitions[(self.current_state, input)] if (self.current_state, input) in self.transitions.keys() else None
		
	def reset(self):
		self.current_state = self.start_state
		
	def run(self, inputs):
		self.reset()
		for input in inputs:
			self.next_state(input)
			self.token += input
		return self.current_state if self.accept() else False

def keyword(keyword, start):
	transitions = {}
	states = []
	for i in range(len(keyword)):
		transitions[(i if i == 0 else start + i, keyword[i])] = i+1
		states.append(i+1)
	accept_states = { start + len(keyword) : keyword.upper() + '_KEYWORD' }
	print(accept_states)
	
	return DFA(states, transitions, 0, accept_states)
	
def string_literal(start):
	states = []
	transitions = {}
	transitions[(0, '"')] = start+1
	#transitions[(0, '"')] = start+2
	for c in string.printable:
		transitions[(start+1, c)] = start+1
	transitions[(start+1, '"')] = start+2
	accept_states = { start+2 : 'STRING_LITERAL' }
	states.append(start+1)
	states.append(start+2)
	
	return DFA(states, transitions, 0, accept_states)
	
def number(start):
	states = []
	transitions = {}
	transitions[(0, '-')] = start+1
	for i in range(10):
		transitions[(0, str(i))] = start+2
		transitions[(start+1, str(i))] = start+2
		transitions[(start+2, str(i))] = start+2
		transitions[(start+3, str(i))] = start+4
		transitions[(start+4, str(i))] = start+4
	transitions[(start+1, '.')] = start+3
	transitions[(start+2, '.')] = start+3
	transitions[(0, '.')] = start+3
	accept_states = { start+2 : 'NUMBER_LITERAL', start+4 : 'NUMBER_LITERAL' }
	states.append(start+1)
	states.append(start+2)
	states.append(start+3)
	states.append(start+4)

	return DFA(states, transitions, 0, accept_states)
	
def identifier(start):
	states = []
	transitions = {}
	for c in string.ascii_letters:
		transitions[(0, c)] = start+1
		transitions[(start+1, c)] = start+1
	for i in range(10):
		transitions[(start+1, str(i))] = start+1
	transitions[(start+1, '_')] = start+1
	accept_states = { start+1 : 'VARIABLE_IDENTIFIER' }
	states.append(start+1)
	
	return DFA(states, transitions, 0, accept_states)
	
def init():	
	dfa = DFA([0], {}, 0, {})
	
	#symbols
	dfa.append(keyword('(', len(dfa.states)))
	dfa.append(keyword(')', len(dfa.states)))
	dfa.append(keyword('[', len(dfa.states)))
	dfa.append(keyword(']', len(dfa.states)))
	dfa.append(keyword('{', len(dfa.states)))
	dfa.append(keyword('}', len(dfa.states)))
	dfa.append(keyword(';', len(dfa.states)))
	dfa.append(keyword(',', len(dfa.states)))
	dfa.append(keyword('?', len(dfa.states)))
	dfa.append(keyword(':', len(dfa.states)))
	dfa.append(keyword('+', len(dfa.states)))
	dfa.append(keyword('-', len(dfa.states)))
	dfa.append(keyword('*', len(dfa.states)))
	dfa.append(keyword('/', len(dfa.states)))
	dfa.append(keyword('%', len(dfa.states)))
	dfa.append(keyword('=', len(dfa.states)))
	dfa.append(keyword('&&', len(dfa.states)))
	dfa.append(keyword('||', len(dfa.states)))
	dfa.append(keyword('!', len(dfa.states)))
	dfa.append(keyword('==', len(dfa.states)))
	dfa.append(keyword('!=', len(dfa.states)))
	dfa.append(keyword('>', len(dfa.states)))
	dfa.append(keyword('<', len(dfa.states)))
	dfa.append(keyword('>=', len(dfa.states)))
	dfa.append(keyword('<=', len(dfa.states)))
	dfa.append(keyword('@', len(dfa.states)))
	dfa.append(keyword('@@', len(dfa.states)))
	dfa.append(keyword('++', len(dfa.states)))
	dfa.append(keyword('--', len(dfa.states)))
	
	#keywords
	dfa.append(keyword('break', len(dfa.states)))
	dfa.append(keyword('continue', len(dfa.states)))
	dfa.append(keyword('def', len(dfa.states)))
	dfa.append(keyword('input', len(dfa.states)))
	dfa.append(keyword('output', len(dfa.states)))
	dfa.append(keyword('if', len(dfa.states)))
	dfa.append(keyword('elsif', len(dfa.states)))
	dfa.append(keyword('else', len(dfa.states)))
	dfa.append(keyword('switch', len(dfa.states)))
	dfa.append(keyword('case', len(dfa.states)))
	dfa.append(keyword('default', len(dfa.states)))
	dfa.append(keyword('break', len(dfa.states)))
	dfa.append(keyword('while', len(dfa.states)))
	dfa.append(keyword('do', len(dfa.states)))
	dfa.append(keyword('for', len(dfa.states)))
	dfa.append(keyword('foreach', len(dfa.states)))
	dfa.append(keyword('in', len(dfa.states)))
	dfa.append(keyword('function', len(dfa.states)))
	dfa.append(keyword('return', len(dfa.states)))
	dfa.append(keyword('true', len(dfa.states)))
	dfa.append(keyword('false', len(dfa.states)))
	
	dfa.append(string_literal(len(dfa.states)))
	dfa.append(number(len(dfa.states)))
	dfa.append(identifier(len(dfa.states)))
	
	return dfa
	
dfa = init()
code = open('sample.ric', 'r')
stream = code.read()
tokens = []

for i in range(len(stream)):
	stream = stream.strip()
	if dfa.run(stream[0:i]):
		tokens.append(dfa.token)
		stream = stream[i:]
	print(stream)

print(tokens)