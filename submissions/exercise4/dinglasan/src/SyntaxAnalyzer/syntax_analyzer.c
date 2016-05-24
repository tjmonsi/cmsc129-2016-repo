#include "syntax_analyzer.h"
#include "grammar_fxns2.h"
#include "grammar_fxns.h"

int main(){
	id = line_no = 0, head = NULL, tail = NULL, root = NULL, thereIsError = 0;
	storeTokens();
	CODE();
	printArray();
	printParseTree();
	clearNodes();
	return 0;
}
