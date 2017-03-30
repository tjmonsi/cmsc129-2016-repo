#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define LINE 200
#define CHILD 10
#define LEN 20

int ACTION();
int ARITH();
int VAR();
int isACTION();

enum type{
	none,
	unary,
	binary,
	trinary
};

typedef struct list{
	int id;
	int type;
	int taken;
	char token[LEN];
	struct list *next;
}node;

node *head, *tail, *p, *head2, *tail2, *q;
char filename[LEN];
int line_no, id, error, hoo;
FILE *fp;

node * initializeNode(char word[LEN], int type){
	node *newNode;
	newNode = (node *) malloc(sizeof(node));
	newNode->next = NULL;
	newNode->id = id;
	newNode->type = type;
	newNode->taken = 0;
	strcpy(newNode->token, word);
	id++;
	return newNode;
}

void insertToList(node *newNode){
	if(head != NULL) tail->next = newNode;
	else head = newNode;		
	tail = newNode;			
}

void insertToList2(node *newNode){
	if(head2 != NULL) tail2->next = newNode;
	else head2 = newNode;		
	tail2 = newNode;			
}

void popList2(){
	for(p = head2; p->next != tail2; p = p->next);
	p->next = NULL;
	free(tail2);
	tail2 = p;	
}

void storeTokens(){
	FILE *fp;
	char line[LINE], *token, word[LEN];
	const char space[2] = " ";
	node *newNode;

	fp = fopen("token.tk", "r");
	fscanf(fp, "%s\n", filename);

	while(!feof(fp)){
		strcpy(line, "");
		fgets(line, LINE, fp);
		token = strtok(line, space);

		while(token != NULL){			
			newNode = initializeNode(token, none);
			insertToList(newNode);	
			token = strtok(NULL, space);
		}	
	}
	fclose(fp);	
}

char * peekList(){
	if(head != NULL) return head->token;	
	return "NULL";	
}

void dequeueList(){
	if(head != NULL){
		p = head;
		head = head->next;
		free(p);
	}
}

int isDelimiter(char c){
	switch(c){
		case '\n':
			line_no++;
			return 1;
		default:
			return 0;		
	}
}

void panicMode(){
	char word[LEN] = "a";
	error++;
	while(!isDelimiter(word[0]) && head != NULL){
		strcpy(word, peekList());	
		dequeueList();
	}
}

void checkNewLine(){
	if(head != NULL){
		while(strcmp(peekList(), "\n") == 0){
			line_no++;
			dequeueList();
		}
		while(strcmp(peekList(), "\t") == 0){
			dequeueList();
			checkNewLine();
		}
	}	
}

int rBrack(){
	if(strcmp(peekList(), "]") !=  0){
		printf("%s>line#%d: missing ']' or error before/at %s token\n",
		filename, line_no, strcmp(peekList(), "\n")==0?"newline":peekList());
		return 0;}
	else return 1;	
}

int lPare(){
	if(strcmp(peekList(), "(") !=  0){
		printf("%s>line#%d: missing '(' or error before/at %s token\n", 
		filename, line_no, strcmp(peekList(), "\n")==0?"newline":peekList());
		return 0;}	
	else return 1;
}

int rPare(){
	if(strcmp(peekList(), ")") !=  0){
		printf("%s>line#%d: missing ')' or error before/at %s token\n", 
		filename, line_no, strcmp(peekList(), "\n")==0?"newline":peekList());
		return 0;}	
	else return 1;
}

int comma(){
	if(strcmp(peekList(), ",") !=  0){
		printf("%s>line#%d: missing ',' or error before/at %s token\n", 
		filename, line_no, strcmp(peekList(), "\n")==0?"newline":peekList());
		return 0;}	
	else return 1;
}

int sColon(){
	if(strcmp(peekList(), ";") !=  0){
		printf("%s>line#%d: missing ';' or error before/at %s token\n", 
		filename, line_no, strcmp(peekList(), "\n")==0?"newline":peekList());
		return 0;}	
	else return 1;
}

int number(){
	if(strcmp(peekList(), "<number>") ==  0) {
		p = initializeNode("<number>", none);
		insertToList2(p);
		return 1;
	}	
	else return 0;
}

int STRING(){
	if(strcmp(peekList(), "<STRING>") ==  0) {
		p = initializeNode("<STRING>", none);
		insertToList2(p);
		return 1;
	}	
	else return 0;
}


int TYPE(){
	if(strcmp(peekList(), "numero") ==  0 ||
		strcmp(peekList(), "lutang") ==  0 ||
		strcmp(peekList(), "karakter") ==  0 ){
		dequeueList();
		p = initializeNode("<TYPE>", none);
		insertToList2(p);
		return 1;
	}
	else return 0;
}

int FCPARAM(){

	p = initializeNode("<FCPARAM>", binary);
	insertToList2(p);

	if( isACTION() ){
		if( strcmp(peekList(), ",") ==  0 ){
			dequeueList();
			if( !FCPARAM() ) return 0;			
		}
		else {
			p = initializeNode("<FCPARAM>", unary);
			insertToList2(p);
			p = initializeNode("ε", none);
			insertToList2(p);
		}
	}
	return 1;
}

int FCALL(){	

	p = initializeNode("<FCALL>", unary);
	insertToList2(p);

	if( !FCPARAM() ) return 0;	

	if( isACTION() ){
		printf("%s>line#%d: missing ',' token\n", filename, line_no);
		return 0;
	}

	if( !rPare() ) return 0;	
	dequeueList();	

	return 1;
}

int ARR(){

	p = initializeNode("<ARR>", binary);
	insertToList2(p);

	if( !isACTION() ){
		printf("%s>line#%d: missing array size\n", filename, line_no);
		return 0;
	}
	if( !rBrack() ) return 0;	
	dequeueList();

	if(strcmp(peekList(), "[") ==  0){
		dequeueList();
		if( !ARR() ) return 0;		
	}
	else{
		p = initializeNode("<ARR>", unary);
		insertToList2(p);

		p = initializeNode("ε", none);
		insertToList2(p);
	}
	

	return 1;
}

int VAR(){
	if(strcmp(peekList(), "<VAR>") !=  0) return 0;	
	dequeueList();
	if(hoo == 1) return 1;
	if(strcmp(peekList(), "(") ==  0){
		p = initializeNode("<VAR>", unary);
		insertToList2(p);
		dequeueList();
		if( !FCALL() ) return 0;		
	}
	else if(strcmp(peekList(), "[") ==  0){
		p = initializeNode("<VAR>", unary);
		insertToList2(p);
		dequeueList();
		if( !ARR() ) return 0;		
	}
	else{
		p = initializeNode("<VAR>", none);
		insertToList2(p);
	}
	return 1;
}

int isACTION(){

	p = initializeNode("<ACTION>", unary);
	insertToList2(p);

	if(ARITH());
	else if(VAR());
	else if(number()) dequeueList();
	else {
		popList2();
		return 0;	
	}	
}


int ACTION(){

	p = initializeNode("<ACTION>", unary);
	insertToList2(p);

	int foo = 0;
	if(foo = ARITH());
	else if(VAR());
	else if(number()) dequeueList();		
	if(foo == -1){
		return 0;
	}
	return 1;
}

int BOOL(){
	if(strcmp(peekList(), "masmalaki") ==  0 ||
	strcmp(peekList(), "masmaliit") ==  0 ||
	strcmp(peekList(), "parehas") == 0 ||
	strcmp(peekList(), "hindeRehas") == 0 ||
	strcmp(peekList(), "lakiRehas") == 0 ||
	strcmp(peekList(), "liitRehas") == 0)	
		dequeueList();	
	else return 0;

	p = initializeNode("<BOOL>", binary);
	insertToList2(p);

	if( !lPare() ) return 0;	
	dequeueList();

	if( !isACTION() ) return 0;	

	if( !comma() ) return 0;
	dequeueList();

	if( !isACTION() ) return 0;
	
	if( !rPare() ) return 0;
	dequeueList();

	return 1;
}

int ARITH(){
	if(strcmp(peekList(), "plas") ==  0 ||
	strcmp(peekList(), "maynus") ==  0 ||
	strcmp(peekList(), "dibayd") == 0 ||
	strcmp(peekList(), "multiplay") == 0 ||
	strcmp(peekList(), "modyulo") == 0)
		dequeueList();	
	else return 0;

	p = initializeNode("<ARITH>", binary);
	insertToList2(p);

	if( !lPare() ) return 0;	
	dequeueList();

	if( !isACTION() ) return 0;	

	if( !comma() ) return 0;
	dequeueList();

	if( !isACTION() ) return 0;
	
	if( !rPare() ) return 0;
	dequeueList();

	return 1;
}

int OUT(){
	if(strcmp(peekList(), "isulat") ==  0)
		dequeueList();	
	else return 0;

	p = initializeNode("<OUT>", unary);
	insertToList2(p);

	if( !lPare() ) return 0;
	dequeueList();

	if( STRING() ) dequeueList();		
	else if( !ACTION() ) return 0;
	
	if( !rPare() ) return 0;	
	dequeueList();

	return 1;
}

int IN(){
	if(strcmp(peekList(), "ikuha") ==  0)
		dequeueList();	
	else return 0;

	p = initializeNode("<IN>", unary);
	insertToList2(p);

	if( !lPare() ) return 0;	
	dequeueList();

	if( !VAR() ) return 0;	

	if( !rPare() ) return 0;	
	dequeueList();

	return 1;
}

int INIT(){
	if(strcmp(peekList(), "=") ==  0)
		dequeueList();	
	else return 0;
	p = initializeNode("<INIT>", unary);
	insertToList2(p);
	if( !ACTION() ) return 0;
	return 1;
}

int VARDEC(){
	int foo;
	p = initializeNode("<VARDEC>", binary);
	insertToList2(p);
	if( !TYPE() ) {
		popList2();
		return 0;
	}		
	if( !VAR() ) return 0;
	if( foo = INIT() );
	if(foo == -1) {
		return 0;
	}
	return 1;
}

int FILE_(){
	if(strcmp(peekList(), "payl") ==  0)
		dequeueList();	
	else return 0;

	p = initializeNode("<FILE>", unary);
	insertToList2(p);

	if( !lPare() ) return 0;	
	dequeueList();

	if( !VAR() ) return 0;	

	if( !rPare() ) return 0;	
	dequeueList();

	return 1;
}

int PARAM(){

	p = initializeNode("<PARAM>", binary);
	insertToList2(p);	

	if( !TYPE() ) {
		popList2();
		return 0;
	}	
	
	hoo = 1;
	if( !VAR() ) return 0;
	hoo = 0;

	p = initializeNode("<VAR>", none);
	insertToList2(p);

	if( strcmp(peekList(), ",") ==  0 ){
		dequeueList();
		if( !PARAM() ) return 0;		
	}
	return 1;
}

int FXN(){
	int foo;
	if(strcmp(peekList(), "panksyon") ==  0)
		dequeueList();	
	else return 0;	

	p = initializeNode("<FXN>", unary);
	insertToList2(p);	

	hoo = 1;
	if( !VAR() ) return 0;	
	hoo = 0;

	p = initializeNode("<VAR>", none);
	insertToList2(p);

	if( !lPare() ) return 0;	
	dequeueList();

	if( foo = PARAM() );
	if(foo == -1) return 0;

	if( !rPare() ) return 0;	
	dequeueList();
}

int RETURN(){
	if(strcmp(peekList(), "ibigay") ==  0)
		dequeueList();	
	else return 0;

	p = initializeNode("<RETURN>", unary);
	insertToList2(p);

	if( !lPare() ) return 0;
	dequeueList();

	if( !ACTION() ) return 0;
	
	if( !rPare() ) return 0;	
	dequeueList();

	return 1;	
}

int LOOP(){
	if(strcmp(peekList(), "habang") ==  0)
		dequeueList();	
	else return 0;	

	p = initializeNode("<LOOP>", unary);
	insertToList2(p);

	if( !lPare() ) return 0;
	dequeueList();

	if( !BOOL() ) return 0;	

	if( !rPare() ) return 0;	
	dequeueList();

	return 1;
}

int ELSE(){
	if(strcmp(peekList(), "kungHinde") ==  0)
		dequeueList();	
	else return 0;	

	p = initializeNode("<ELSE>", unary);
	insertToList2(p);	

	return 1;
}

int ELSIF(){
	if(strcmp(peekList(), "eKung") ==  0)
		dequeueList();	
	else return 0;	

	p = initializeNode("<ELSIF>", unary);
	insertToList2(p);	

	if( !lPare() ) return 0;
	dequeueList();

	if( !BOOL() ) return 0;

	if( !rPare() ) return 0;	
	dequeueList();

	return 1;
}

int IF(){
	if(strcmp(peekList(), "kung") ==  0)
		dequeueList();	
	else return 0;	

	p = initializeNode("<IF>", unary);
	insertToList2(p);	

	if( !lPare() ) return 0;
	dequeueList();

	if( !BOOL() ) return 0;

	if( !rPare() ) return 0;	
	dequeueList();

	return 1;
}

void STMT(){
	int foo;

	checkNewLine();

	p = initializeNode("<STMT>", binary);
	insertToList2(p);

	if( foo = OUT() );	
	else if( foo = IN() );
	else if( foo = ARITH() );
	else if( foo = BOOL() );
	else if( foo = VARDEC() );
	else if( foo = FILE_() );
	else if( foo = FXN() );
	else if( foo = RETURN() );
	else if( foo = LOOP() );
	else if( foo = IF() );
	else if( foo = ELSIF() );
	else if( foo = ELSE() );
	else if( strcmp(peekList(), "tapos") ==  0 ||
		strcmp(peekList(), "NULL") ==  0){
		popList2();
		p = initializeNode("<STMT>", unary);
		insertToList2(p);
		p = initializeNode("ε", none);
		insertToList2(p);
		return;
	}
	if(foo == -1 || foo == 0){		
		printf("%s>line#%d: invalid statement\n", filename, line_no);
		panicMode();
	}	
	else if( !sColon() ) panicMode();
	else dequeueList();
	STMT();
}

void CODE(){
	int error;
	p = initializeNode("<CODE>", unary);
	insertToList2(p);

	checkNewLine();
	while(1){
		if(strcmp(peekList(), "simula") !=  0){
			printf("%s>line#%d: missing or error before \"simula\" token\n",
			filename, line_no);
			panicMode();break;
		}
		else dequeueList();
		if(strcmp(peekList(), ";") !=  0){
			printf("%s>line#%d: expected ';' after \"simula\" token\n",
			filename, line_no);
			panicMode();
		}
		else dequeueList();break;
	}		
	STMT();
	checkNewLine();	
	while(1){
		if( strcmp(peekList(), "tapos") !=  0){
			printf("%s>line#%d: missing or error before \"tapos\" token\n",
			filename, line_no);
			panicMode();break;
		}
		else dequeueList();
		if(strcmp(peekList(), ";") !=  0){
			printf("%s>line#%d: expected ';' after \"tapos\" token\n",
			filename, line_no);
			panicMode();
		}
		else dequeueList();break;
	}	
}

void createBranch(int size){
	int i = 0;
	do{
		if(i == 0 || i % 10 == 0)
			fprintf(fp, "v ");		
		else
			fprintf(fp, "- ");		
		i++;
	}while(i<((size-1)*10)+1);
	fprintf(fp, "\n");	
}

void findSameToken(){
	int val;
	q = p->next;
	while(q != NULL){
		val = strcmp(q->token, p->token);
		if(val == 0) break;
		q = q->next;
	}
	if(q==NULL) q = p;
}

void findSameToken2(){
	int val;
	q = q->next;
	while(q != NULL){
		val = strcmp(q->token, p->next->token);
		if(val == 0) break;
		q = q->next;
	}
	if(q==NULL) q = p;	

}

void createLeaf(int size){
	int i = 0, s = 0;
	q = p->next;
	while(1){
		if(i == 0 || i % 20 == 0){
			if(q->taken == 0){
				fprintf(fp, "%s(%d)", q->token, q->id);
				q->taken++;
			}
			else{
				findSameToken2();
				continue;
			}
			i += strlen(q->token);	
			if(q->id < 10) i += 3;
			else i += 4;
			s++;	
			if(s == size) break;
			if(strcmp(p->token, "<ARITH>") == 0 ||
			strcmp(p->token, "<BOOL>") == 0)
				findSameToken2();
			else if(strcmp(p->token, "<VARDEC>") == 0 ||
			strcmp(p->token, "<FXN>") == 0 ||
			strcmp(p->token, "<PARAM>") == 0)
				q = q->next;
			else findSameToken();
		}
		else{
			fprintf(fp, " ");	
			i++;	
		}		
	}	
}

void createForest(){

	fp = fopen("tree.txt", "w");

	for(p = head2; p != NULL; p = p->next){		
		if(p->type != none) {
			fprintf(fp, "%s(%d)\n|\n", p->token, p->id);
			createBranch(p->type);
			createLeaf(p->type);
			fprintf(fp, "\n\n\n");
		}		
	}	
	fclose(fp);
}

void printList(){

	fp = fopen("array.txt", "w");
	for(p = head2; p != NULL; p = p->next){
		fprintf(fp, "%s(%d) ", p->token, p->id);
	}
	fclose(fp);	
}

void clearNodes(){
	for(p = head2; head2 != NULL; p = head2){
		head2 = head2->next;
		free(p);
	}
}