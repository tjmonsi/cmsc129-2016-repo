/*
This file contains the grammar in its programmed form.
It mostly contains terminal rules.
*/

int FXNNAME(){
	if(ALPHABET()){			
	}
	else{
		return 0;	
	}
}

int STRING(){
	if(strcmp(peekList(), "\"") !=  0) return 0;
	dequeueList();
	addToTree("\"");	
	while(strcmp(peekList(), "\"") != 0){
		if(strcmp(peekList(), "\n") == 0){
			reportError('"');
			return -1;
		}
		if(!isSymbol(peekList()[0])){
			dequeueList();
		}	
		addToTree(peekList());
		dequeueList();	
	}
	dequeueList();
	addToTree("\"");
	return 1;
}

int NEW(){
	if(strcmp(peekList(), "\n") !=  0 && strcmp(peekList(), "\t") !=  0){		
		return 0;
	}
	while(strcmp(peekList(), "\n") ==  0 || strcmp(peekList(), "\t") ==  0){
		if(strcmp(peekList(), "\n") ==  0 ) line_no++;	
		dequeueList();			
	}
	return 1;
}

int alphabet(){
	if(strcmp(peekList(), "<alphabet>") !=  0) {
		return 0;
	}	
	dequeueList();
	addToTree(peekList());
	dequeueList();
	return 1;	
}

int ALPHABET(){
	if(strcmp(peekList(), "<alphabet>") !=  0) {
		reportError('n');
		return 0;
	}	
	dequeueList();
	dequeueList();
	return 1;	
}

int colon(){
	if(strcmp(peekList(), ":") !=  0){
		reportError(':');
		return 0;
	}
	dequeueList();
	addToTree(":");
	return 1;	
}

int tab(){
	if(strcmp(peekList(), "\t") !=  0){
		return 0;
	}
	dequeueList();
	return 1;		
}

int rPare(){
	if(strcmp(peekList(), ")") !=  0){
		reportError(')');
		return 0;
	}
	dequeueList();
	addToTree(")");
	return 1;
}

int semiCol(){
	if(strcmp(peekList(), ";") !=  0){
		reportError(';');
		return 0;
	}
	dequeueList();
	addToTree(";");
	return 1;
}

int lPare(){
	if(strcmp(peekList(), "(") !=  0){
		reportError('(');
		return 0;
	}
	dequeueList();
	addToTree("(");
	return 1;
}

int comma(){
	if(strcmp(peekList(), ",") !=  0){
		reportError(',');
		return 0;
	}
	dequeueList();
	addToTree(",");
	return 1;	
}

int comma2(){
	if(strcmp(peekList(), ",") !=  0){
		return 0;
	}
	dequeueList();
	return 1;	
}

int lBrack(){
	if(strcmp(peekList(), "[") !=  0){
		return 0;
	}
	dequeueList();
	return 1;	
}

int rBrack(){
	if(strcmp(peekList(), "]") !=  0){
		reportError(']');
		return 0;
	}
	dequeueList();
	return 1;	
}

int dollar(){
	if(strcmp(peekList(), "$") !=  0){
		return 0;
	}
	dequeueList();
	return 1;	
}

int equal(){
	if(strcmp(peekList(), "=") !=  0){
		return 0;
	}
	dequeueList();
	addToTree("=");
	return 1;	
}

int NUMBER(){
	if(strcmp(peekList(), "<number>") !=  0) {
		return 0;
	}	
	dequeueList();
	addToTree(peekList());
	dequeueList();
	return 1;	
}

int arith(){
	if(strcmp(peekList(), "plas") ==  0 ||
	strcmp(peekList(), "maynus") ==  0 ||
	strcmp(peekList(), "dibayd") == 0 ||
	strcmp(peekList(), "multiplay") == 0 ||
	strcmp(peekList(), "modyulo") == 0){
		addToTree("<ARITH_B>");
		current = latest;
		addToTree(peekList());		
		dequeueList();
		return 1;
	}
	else{
		return 0;	
	}
}

int bool(){
	if(strcmp(peekList(), "masmalaki") == 0 ||
	strcmp(peekList(), "masmaliit") == 0 ||
	strcmp(peekList(), "parehas") == 0 ||
	strcmp(peekList(), "hindeRehas") == 0 ||
	strcmp(peekList(), "lakiRehas") == 0 ||
	strcmp(peekList(), "liitRehas") == 0){
		addToTree("<BOOL_B>");
		current = latest;
		addToTree(peekList());
		dequeueList();
		return 1;
	}
	else{
		return 0;	
	}
}

int bool2(){
	if(strcmp(peekList(), "hinde") ==  0){
		addToTree("<BOOL_B>");
		current = latest;
		addToTree(peekList());
		dequeueList();
		return 1;
	}
	else{
		return 0;	
	}
}

int bool3(){
	if(strcmp(peekList(), "at") ==  0 ||
	strcmp(peekList(), "o") ==  0){
		addToTree("<BOOL_B>");
		current = latest;
		addToTree(peekList());
		dequeueList();
		return 1;
	}
	else{
		return 0;	
	}
}

int isCheckpoint(){
	if(strcmp(peekList(), "tapos") ==  0 ||
	strcmp(peekList(), "noysknap") ==  0 ||	
	strcmp(peekList(), "gnabah") ==  0 ||
	strcmp(peekList(), "rop") ==  0 ||
	strcmp(peekList(), "end of line") ==  0 ||
	strcmp(peekList(), "gnuk") ==  0 ||
	strcmp(peekList(), "gnuKe") ==  0 ||
	strcmp(peekList(), "edniHgnuk") ==  0)
		return 1;
	else return 0;
}

int isCheckpoint2(){
	if(strcmp(peekList(), "noysknap") ==  0 ||	
	strcmp(peekList(), "gnabah") ==  0 ||
	strcmp(peekList(), "rop") ==  0 ||
	strcmp(peekList(), "end of line") ==  0 ||
	strcmp(peekList(), "gnuk") ==  0 ||
	strcmp(peekList(), "gnuKe") ==  0 ||
	strcmp(peekList(), "edniHgnuk") ==  0)
		return 1;
	else return 0;
}
