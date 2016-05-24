/*
This file contains the grammar in its programmed form.
It mostly contains non-terminal rules.
*/

void CODE();
void LINE();
int STMT();
int OUT();
int IN();
int BIN_A();
int BIN_B();
int ARITH_A();
int ARITH_B();
int BOOL_A();
int BOOL_B();
int VARDEC_A();
int VARDEC_B();
int INIT();
int TYPE();
int _FILE();
int FXNCALL_A();
int FXNCALL_B();
int FCPARAM_A();
int FCPARAM_B();
int WHILE();
int DO();
int FOR();
int COND();
int ELSIF();
int ELSE();
int ACTION();
int VAR();
int ARR();
int action();
int FILE_OUT();
int FILE_IN();
int ASS();
int RANDOM();
int SQRT();

void CODE(){
	addToTree("<CODE>");
	current = latest;
	NEW();
	if(strcmp(peekList(), "simula") !=  0){
		reportError('a');
		panicMode();
	}
	else{
		dequeueList();
		addToTree("simula");
	}	
	LINE();

	if(isCheckpoint2()){
		panicMode();
		LINE();
	}

	if(strcmp(peekList(), "tapos") !=  0){
		reportError('z');
		panicMode();
	}
	else{
		dequeueList();
		addToTree("tapos");
	}
}

void LINE(){
	addToTree("<LINE>");
	current = latest;
	NEW();
	if( foo = STMT());
	else if(isCheckpoint()){
		addToTree("ε");
		current = current->parent->parent;
		return;
	}
	else{
		foo = -1;
		reportError('x');
	}
	if(foo == -1){
		panicMode();
	}
	LINE();	
	current = current->parent;
}

int STMT(){
	addToTree("<STMT>");
	current = latest;
	
	if( foo = FXNCALL_A() );
	else if( foo = OUT() );
	else if( foo = ARITH_A() );
	else if( foo = BOOL_A() );
	else if( foo = COND() );
	else if( foo = VARDEC_A() );
	else if( foo = IN() );
	else if( foo = _FILE() );
	else if( foo = WHILE() );
	else if( foo = FOR() );
	else if( foo = FXN() );
	else if( foo = RETURN() );
	else if( foo = FILE_OUT() );
	else if( foo = FILE_IN() );
	else if( foo = ASS() );
	else {
		return 0;
	}
	current = current->parent;
	return foo;
}

int OUT(){	
	if(strcmp(peekList(), "isulat") ==  0){
		dequeueList();	
		addToTree("<OUT>");
		current = latest;
		addToTree("isulat");
	}
	else{ 
		return 0;
	}
	if(lPare()){		
	}
	else{		
		return -1;
	}	
	if( foo = STRING() );
	else if(foo = ACTION() );
	else{
		reportError('p');
		return -1;
	}
	if(foo == -1){
		return -1;
	}
	if(rPare()){		
	}
	else{		
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;
}

int IN(){
	if(strcmp(peekList(), "ikuha") ==  0){
		dequeueList();	
		addToTree("<IN>");
		current = latest;
		addToTree("ikuha");
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(VAR()){
	}
	else{
		reportError('p');
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;	
}

int BIN_A(){
	//addToTree("<BIN_A>");
	//current = latest;
	if(lPare()){
	}
	else{		
		return 0;
	}
	if(ACTION()){
	}
	else{		
		return 0;
	}	
	if(comma()){
	}
	else{				
		return 0;
	}
	if(ACTION()){		
	}
	else{		
		return 0;
	}
	if(rPare()){
	}
	else{		
		return 0;
	}
	//current = current->parent;
	return 1;
}

int BIN_B(){
	//addToTree("<BIN_B>");
	//current = latest;
	if(lPare()){		
	}
	else{		
		return 0;
	}
	if(BOOL_B()){
	}
	else{		
		return 0;
	}	
	if(comma()){
	}
	else{				
		return 0;
	}
	if(BOOL_B()){		
	}
	else{		
		return 0;
	}
	if(rPare()){
	}
	else{		
		return 0;
	}
	//current = current->parent;
	return 1;
}

int ARITH_A(){
	if(arith()){
	}
	else{
		return 0;	
	}
	if(BIN_A()){
	}
	else{		
		return -1;
	}
	if(semiCol()){		
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;
}

int ARITH_B(){
	if(arith()){			
	}
	else{
		return 0;	
	}
	if(BIN_A()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;	
}

int BOOL_A(){
	if(bool()){			
		if(BIN_A()){
		}
		else{		
			return -1;
		}
	}
	else if(bool2()){
		if(lPare()){
		}
		else{		
			return -1;
		}
		if(BOOL_B()){
		}
		else{		
			reportError('p'); 
			return -1;
		}
		if(rPare()){
		}
		else{		
			return -1;
		}
	}
	else if(bool3()){
		if(BIN_B()){
		}
		else{		
			return -1;
		}
	}	
	else{
		return 0;	
	}
	if(semiCol()){		
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;
}

int BOOL_B(){
	if(bool()){			
		if(BIN_A()){
		}
		else{		
			return 0;
		}
	}
	else if(bool2()){
		if(lPare()){
		}
		else{		
			return 0;
		}
		if(BOOL_B()){
		}
		else{		
			return 0;
		}
		if(rPare()){
		}
		else{		
			return 0;
		}
	}
	else if(bool3()){
		if(BIN_B()){
		}
		else{		
			return 0;
		}
	}	
	else{
		return 0;	
	}
	current = current->parent;
	return 1;
}

int VARDEC_A(){
	if(TYPE()){
	}
	else{
		return 0;
	}		
	addToTree("<VARDEC_A>");
	current = latest;
	addToTree("<TYPE>");
	current = latest;
	addToTree(peekList());
	dequeueList();
	current = current->parent;
	if(VARDEC_B()){
	}
	else{		
		return -1;
	}
	if(semiCol()){		
	}
	else{		
		return -1;
	}	
	current = current->parent;
	return 1;
}

int VARDEC_B(){
	addToTree("<VARDEC_B>");
	current = latest;
	if(INIT()){
	}
	else{
		return 0;
	}
	if(comma2()){
		if(VARDEC_B()){
		}
		else{
			return 0;
		}
	}
	current = current->parent;	
	return 1;
}

int INIT(){
	addToTree("<INIT>");
	current = latest;
	if(foo = VAR()){
		if(foo == -1){
			return 0;
		}
	}
	else{		
		return 0;
	}
	if(equal()){
		if(ACTION()){
		}
		else{
			return 0;
		}
	}
	current = current->parent;
	return 1;
}

int TYPE(){
	if(strcmp(peekList(), "numero") ==  0 ||
	strcmp(peekList(), "karakter") ==  0 ||
	strcmp(peekList(), "lutang") == 0){
		return 1;
	}
	else{
		return 0;	
	}
}

int _FILE(){
	if(strcmp(peekList(), "payl") ==  0){
		dequeueList();	
		addToTree("<FILE>");
		current = latest;
		addToTree("payl");	
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	
	if( foo = STRING() );
	else if(foo = ACTION() );
	else{
		reportError('p');
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;	

}

int FXN(){
	if(strcmp(peekList(), "panksyon") ==  0){
		dequeueList();	
	}
	else{ 
		return 0;
	}
	if(TYPE()){
	}
	else{
		return -1;
	}	
	if(FXNNAME()){			
	}
	else{
		return -1;	
	}	
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(PARAM() == -1){
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(colon()){
	}
	else{		
		return -1;
	}
	LINE();
	if(strcmp(peekList(), "noysknap") ==  0){
		dequeueList();	
	}
	else{ 
		reportError('m');
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	return 1;
}

int RETURN(){
	if(strcmp(peekList(), "ibigay") ==  0){
		dequeueList();	
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(action() == -1){
		return -1;
	}	
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}			
}

int PARAM(){
	if(TYPE()){
	}
	else{
		return 0;
	}
	if(VAR()){
	}
	else{
		return -1;
	}	
	if(comma2()){
		if(PARAM() == -1){
			return -1;
		}
	}	
	return 1;
}

int FXNCALL_A(){
	if(dollar()){			
	}
	else{
		return 0;	
	}
	if(FXNNAME()){			
	}
	else{
		return -1;	
	}
	if(lPare()){
	}
	else{		
		return -1;
	}
	if(FCPARAM_A()){
	}
	else{		
		return -1;
	}	
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(semiCol()){		
	}
	else{		
		return -1;
	}
	return 1;
}

int FXNCALL_B(){
	if(dollar()){			
	}
	else{
		return 0;	
	}
	if(FXNNAME()){			
	}
	else{
		return -1;	
	}
	if(lPare()){
	}
	else{		
		return -1;
	}
	if(FCPARAM_A()){
	}
	else{		
		return -1;
	}	
	if(rPare()){
	}
	else{		
		return -1;
	}
	return 1;
}

int FCPARAM_A(){
	if(action()){
	}
	else{		
		return 1;
	}	
	if(foo == -1){
		return 0;
	}
	foo = FCPARAM_B();
	return foo;
}

int FCPARAM_B(){

	if(comma2()){
	}
	else{		
		return 1;
	}	
	if(ACTION()){
	}
	else{		
		return 0;
	}
	foo = FCPARAM_B();
	return foo;
}

int WHILE(){
	if(strcmp(peekList(), "habang") ==  0){
		dequeueList();	
		addToTree("<WHILE>");
		current = latest;
		addToTree("habang");
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(BOOL_B()){
	}
	else{
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(colon()){
	}
	else{		
		return -1;
	}
	LINE();
	if(strcmp(peekList(), "gnabah") ==  0){
		dequeueList();	
		addToTree("gnabah");
	}
	else{ 
		reportError('m');
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	} 
	current = current->parent;
	return 1;
}

int FOR(){
	if(strcmp(peekList(), "por") ==  0){
		dequeueList();	
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(INIT()){
	}
	else{
		return -1;
	}	
	if(semiCol()){
	}
	else{		
		return -1;
	}	
	if(BOOL_B()){
	}
	else{
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}	
	if(INIT()){
	}
	else{
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(colon()){
	}
	else{		
		return -1;
	}
	LINE();
	if(strcmp(peekList(), "rop") ==  0){
		dequeueList();	
	}
	else{ 
		reportError('m');
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	return 1;
}

int COND(){
	if(strcmp(peekList(), "kung") ==  0){
		dequeueList();	
		addToTree("<COND>");
		current = latest;
		addToTree("kung");		
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(BOOL_B()){
	}
	else{
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(colon()){
	}
	else{		
		return -1;
	}
	LINE();
	if(strcmp(peekList(), "gnuk") ==  0){
		dequeueList();	
		addToTree("gnuk");
	}
	else{ 
		reportError('m');
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	NEW();
	ELSIF();
	ELSE();
	current = current->parent;
	return 1;
}

int ELSIF(){
	if(strcmp(peekList(), "eKung") ==  0){
		dequeueList();	
	}	
	else{ 
		return 0;
	}	
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(BOOL_B()){
	}
	else{
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(colon()){
	}
	else{		
		return -1;
	}
	LINE();
	if(strcmp(peekList(), "gnuKe") ==  0){
		dequeueList();	
	}
	else{ 
		reportError('m');
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	ELSIF();
	return 1;
}

int ELSE(){
	if(strcmp(peekList(), "kungHinde") ==  0){
		dequeueList();	
	}	
	else{ 
		return 0;
	}	
	if(colon()){
	}
	else{		
		return -1;
	}
	LINE();
	if(strcmp(peekList(), "edniHgnuk") ==  0){
		dequeueList();	
	}
	else{ 
		reportError('m');
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	return 1;
}

int ACTION(){
	addToTree("<ACTION>");
	current = latest;
	if(foo = NUMBER()){
	}
	else if( foo = VAR() ){
	}
	else if( foo = FXNCALL_B() ){
	}
	else if(foo = ARITH_B()){
	}
	else if(foo = RANDOM()){
	}
	else if(foo = SQRT()){
	}
	else{
		reportError('p');
		return 0;
	}
	current = current->parent;
	return foo+1;
}

int action(){
	if(foo = NUMBER()){
	}
	else if( foo = VAR() ){
	}
	else if( foo = FXNCALL_B() ){
	}
	else if(foo = ARITH_B()){
	}
	else{
		return 0;
	}
	return foo;
}

int VAR(){
	if(alphabet()){			
	}
	else{
		return 0;	
	}
	foo = ARR();
	return foo;
}

int ARR(){
	if(lBrack()){
		addToTree("<ARR>");
		current = latest;
		addToTree("[");
	}
	else{		
		return 1;
	}
	if(ACTION()){		
	}
	else{		
		return -1;
	}
	if(rBrack()){
		addToTree("]");
	}
	else{		
		return -1;
	}
	foo = ARR();
	current = current->parent;
	return foo;
}

int FILE_OUT(){	
	if(strcmp(peekList(), "isulatSaPayl") ==  0){
		dequeueList();	
		addToTree("<FILE_OUT>");
		current = latest;
		addToTree("isulatSaPayl");
	}
	else{ 
		return 0;
	}
	if(lPare()){		
	}
	else{		
		return -1;
	}	
	if( foo = STRING() );
	else if(foo = ACTION() );
	else{
		reportError('p');
		return -1;
	}
	if(foo == -1){
		return -1;
	}
	if(rPare()){		
	}
	else{		
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;
}

int FILE_IN(){
	if(strcmp(peekList(), "ikuhaSaPayl") ==  0){
		dequeueList();	
		addToTree("<FILE_IN>");
		current = latest;
		addToTree("ikuhaSaPayl");
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(VAR()){
	}
	else{
		reportError('p');
		return -1;
	}
	if(rPare()){
	}
	else{		
		return -1;
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;	
}

int ASS(){
	if(strcmp(peekList(), "<alphabet>") !=  0) {
		return 0;
	}	
	addToTree("<ASS>");
	current = latest;
	if(foo = VAR()){
		if(foo == -1){
			return 0;
		}
	}
	else{		
		return 0;
	}
	if(equal()){
		if(ACTION()){
		}
		else{
			return 0;
		}
	}
	if(semiCol()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;
}

int RANDOM(){
	if(strcmp(peekList(), "random") ==  0){
		dequeueList();	
		addToTree("<RANDOM>");
		current = latest;
		addToTree("random");
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(ACTION()){
	}
	else{		
		return 0;
	}	
	if(rPare()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;	
}

int SQRT(){
	if(strcmp(peekList(), "parigat") ==  0){
		dequeueList();	
		addToTree("<SQRT>");
		current = latest;
		addToTree("parigat");
	}
	else{ 
		return 0;
	}
	if(lPare()){
	}
	else{		
		return -1;
	}	
	if(ACTION()){
	}
	else{		
		return 0;
	}	
	if(rPare()){
	}
	else{		
		return -1;
	}
	current = current->parent;
	return 1;	
}