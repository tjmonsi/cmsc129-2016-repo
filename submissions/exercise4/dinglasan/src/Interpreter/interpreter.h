#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <math.h>
#define LEN 100
#define MAX_CHILD 100

//structure used in building the parse tree
typedef struct list{
	int id;
	int noOfChild;
	char token[LEN];
	struct list *next;
	struct list *sNext;
	struct list *parent;
	struct list *child[MAX_CHILD];
}node;

//structure used for the variables to be stored
typedef struct list2{
	char name[LEN];
	char type[LEN];
	int numOfValue;
	int *intValue;
	float *floatValue;
	char *charValue;
	struct list2 *next;
}table;

//boolean implementation for C
typedef enum boolean{
	false,
	true
}bool; 

int executeAction(node *currentNode);
void executeTree(node *currentNode);

//global variables
node *head, *tail, *p, *root, *current, *latest, *tos, *stack, *r;
table *varTable, *q;
char name[LEN], type[LEN], temp[LEN];;
bool skip;
int boolStack[100];
FILE *fp;

//allocates a variable to the memory
table * initializeVarNode(int numOfValue){
	table *newNode;
	newNode = (table *) malloc(sizeof(table));
	strcpy(newNode->name, name);
	strcpy(newNode->type, type);
	newNode->numOfValue = numOfValue;
	if(strcmp(type, "numero") == 0){
		newNode->intValue = (int *) malloc(sizeof(int)*(newNode->numOfValue));
	}
	else if(strcmp(type, "karakter") == 0){
		newNode->charValue = (char *) malloc(sizeof(char)*(newNode->numOfValue));
	}
	newNode->next = NULL;
	return newNode;
}

//inserts a variable to the list
void insertToTable(table *newNode){
	if(varTable != NULL){
		newNode->next = varTable;
	}
	varTable = newNode;
}

//allocates a node to the memory
node * initializeTreeNode(char word[LEN], int id){
	int i;
	node *newNode;
	newNode = (node *) malloc(sizeof(node));
	newNode->id = id;
	newNode->noOfChild = 0;
	strcpy(newNode->token, word);
	newNode->next = NULL;
	newNode->sNext = NULL;
	newNode->parent = NULL;
	for(i  = 0; i < MAX_CHILD; i++){
		newNode->child[i] = NULL;
	}
	return newNode;
}

//insert a node to the tree
void insertToTree(node *newNode){
	if(root != NULL){
		current->child[current->noOfChild] = newNode;
		current->noOfChild++;
		newNode->parent = current;
		latest->next = newNode;
	}
	else{
		root = newNode;
	}
	latest = newNode;
}

//find a node given a string and an id
void findNode(char word[LEN], int id){
	if(root != NULL){
		for(current = root; current != NULL; current = current->next){
			if(current->id == id)
				break;
		}
	}
	else{
		insertToTree(initializeTreeNode(word, id));
		current = root;
	}	
}

//deallocates all the nodes used
void clearNodes(){
	for(p = root; root != NULL; p = root){
		root = root->next;
		free(p);
	}
	for(q = varTable; varTable != NULL; q = varTable){
		varTable = varTable->next;
		free(q);
	}
}

//get the output from syntax analyzer
void getData(){
	FILE *fp;
	char token[LEN], foo[100], c;
	int id, n, i;
	fp = fopen("output/tree.txt", "r");
	while(!feof(fp)){
		fscanf(fp, "%s %c%i%c\n%c\n", token, &foo[0], &id, &foo[1], &foo[2]);
		findNode(token, id);
		for(n = 0, c = fgetc(fp); c != '\n'; c = fgetc(fp)){
			if(c == 'v')
				n++;
		}
		for(i = 0; n != 0; n--, i++){
			fscanf(fp, "%s %c%i%c\n", token, &foo[0], &id, &foo[1]);
			insertToTree(initializeTreeNode(token, id));
		}
	}
	fclose(fp);
}

//returns the value of a variable
int getValue(char name[LEN], int index){
	for(q = varTable; q != NULL; q = q->next){
		if(strcmp(name, q->name) == 0){
			break;
		}
	}
	if(q != NULL) return q->intValue[index];
}

//pushes a node to the stack used in loops
void pushToStack(node *currentNode){
	if(stack != NULL){
		tos->sNext = currentNode;
	}
	else{
		stack = currentNode;		
	}	
	tos = currentNode;
}

//pops a node from the stack used in loops
node * popFromStack(){
	node *poppedNode;
	r = NULL;
	for(p = stack; p->sNext != NULL; p = p->sNext){
		r = p;
	}
	poppedNode = tos;
	tos = r;
	if(r != NULL) r->sNext = NULL;
	
	if(p == stack){
		stack = NULL;
	}
	return poppedNode;
}

//returns the value of the arithmetic
int executeArith(node *currentNode){
	if(strcmp(currentNode->child[0]->token, "plas") == 0){
		return executeAction(currentNode->child[2]) + executeAction(currentNode->child[4]);
	}	
	else if(strcmp(currentNode->child[0]->token, "maynus") == 0){
		return executeAction(currentNode->child[2]) - executeAction(currentNode->child[4]);
	}
	else if(strcmp(currentNode->child[0]->token, "multiplay") == 0){
		return executeAction(currentNode->child[2]) * executeAction(currentNode->child[4]);
	}
	else if(strcmp(currentNode->child[0]->token, "dibayd") == 0){
		return executeAction(currentNode->child[2]) / executeAction(currentNode->child[4]);
	}	
	else if(strcmp(currentNode->child[0]->token, "modyulo") == 0){
		return executeAction(currentNode->child[2]) % executeAction(currentNode->child[4]);
	}	
}

//finds a variable given a string
void findVar(char name[LEN]){
	for(q = varTable; q != NULL; q = q->next){
		if(strcmp(name, q->name) == 0){
			break;
		}
	}
}

//returns a random number
int executeRandom(node *currentNode){
	int r = executeAction(currentNode->child[2]);
	return rand()%r;
}
//returns the square root of a value
int executeSquareRoot(node *currentNode){
	int r = executeAction(currentNode->child[2]);
	return (int)sqrt(r);
}

//returns the value of an action
int executeAction(node *currentNode){
	int i, j, num;
	if(strcmp(currentNode->child[0]->token, "<ARITH_B>") == 0){
		return executeArith(currentNode->child[0]);
	}
	else if(strcmp(currentNode->child[0]->token, "<RANDOM>") == 0){
		return executeRandom(currentNode->child[0]);
	}
	else if(strcmp(currentNode->child[0]->token, "<SQRT>") == 0){
		return executeSquareRoot(currentNode->child[0]);
	}
	else if(currentNode->child[0]->token[0] == '-'){
		for(i = strlen(currentNode->child[0]->token)-1, j = 1, num = 0; i != 0; i--, j *= 10){
			currentNode->child[0]->token[i] -= 48;
			currentNode->child[0]->token[i] *= j;
			num += currentNode->child[0]->token[i];
		}
		for(i = strlen(currentNode->child[0]->token)-1, j = 1; i != 0; i--, j *= 10){			
			currentNode->child[0]->token[i] /= j;
			currentNode->child[0]->token[i] += 48;
		}
		num *= -1;	
	}
	else if(currentNode->child[0]->token[0] > '9' || currentNode->child[0]->token[0] < '0'){
		findVar(currentNode->child[0]->token);
		if(q != NULL && strcmp(q->type, "numero") == 0){
			if(currentNode->child[1] != NULL && strcmp(currentNode->child[1]->token, "<ARR>") == 0){
				return getValue(currentNode->child[0]->token, executeAction(currentNode->child[1]->child[1]));
			}
			else{
				return getValue(currentNode->child[0]->token, 0);
			}	
		}
		else if(q != NULL && strcmp(q->type, "karakter") == 0){
			if(currentNode->child[1] != NULL && strcmp(currentNode->child[1]->token, "<ARR>") == 0){
				return q->charValue[executeAction(currentNode->child[1]->child[1])];
			}
		}				
	}
	else{
		for(i = strlen(currentNode->child[0]->token)-1, j = 1, num = 0; i != -1; i--, j *= 10){
			num += (currentNode->child[0]->token[i] - 48) * j;
		}
	}
	return num;	
}

//return the boolean value of an expression
int executeBool(node *currentNode){
	int a, b;
	a = executeAction(currentNode->child[2]);
	b = executeAction(currentNode->child[4]);
	if(strcmp(currentNode->child[0]->token, "masmaliit") == 0){
		if(a < b){
			return true;
		}
		else{
			return false;
		}
	}
	else if(strcmp(currentNode->child[0]->token, "masmalaki") == 0){
		if(a > b){
			return true;
		}
		else{
			return false;
		}
	}	
	else if(strcmp(currentNode->child[0]->token, "parehas") == 0){
		if(a == b){
			return true;
		}
		else{
			return false;
		}
	}
	else if(strcmp(currentNode->child[0]->token, "hindeRehas") == 0){
		if(a != b){
			return true;
		}
		else{
			return false;
		}
	}	
	else if(strcmp(currentNode->child[0]->token, "lakiRehas") == 0){
		if(a >= b){
			return true;
		}
		else{
			return false;
		}
	}
	else if(strcmp(currentNode->child[0]->token, "liitRehas") == 0){
		if(a <= b){
			return true;
		}
		else{
			return false;
		}
	}
}

//initializes an integer array to -1
void initBoolStack(){
	int i;
	for(i = 0; i < 100; i++){
		boolStack[i] = -1;
	}
}

//pushes a number to the integer stack
void pushBoolToStack(int n){
	int i;
	for(i = 0; i < 100; i++){
		if(boolStack[i] == -1){
			boolStack[i] = n;
			break;
		}
	}
}

//pops a number from the integer stack
int popBoolFromStack(){
	int i, poppedValue;
	for(i = 0; i < 100; i++){
		if(boolStack[i] == -1){
			poppedValue = boolStack[i-1];
			boolStack[i-1] = -1;
			return poppedValue;
		}
	}	
}

//determines the value of the integer stack
int returnBoolValue(){
	int i;
	for(i = 0; i < 100; i++){
		if(boolStack[i] == -1){
			return 0;
		}
		if(boolStack[i] == 1){
			return 1;
		}
	}	
}

//execute a single node from the parse tree
void executeNode(node *currentNode){
	int i;	
	table *newNode;
	if(strcmp(currentNode->token, "gnuk") == 0){
		popBoolFromStack();
	}
	
	else if(strcmp(currentNode->token, "gnabah") == 0){
		popBoolFromStack();
		if(stack != NULL){
			executeTree(popFromStack());
		}
	}
	else if(strcmp(currentNode->token, "<COND>") == 0){
		if(!executeBool(currentNode->child[2])){
			pushBoolToStack(1);
		}		
		else{
			pushBoolToStack(0);
		}
	}
	else if(boolStack[0] != -1 && returnBoolValue()){}
	else if(strcmp(currentNode->token, "<WHILE>") == 0){
		if(executeBool(currentNode->child[2])){
			pushBoolToStack(0);
			pushToStack(currentNode);
		}
		else{
			node *dummyNode;
			dummyNode = initializeTreeNode("dummy", -1);
			pushBoolToStack(1);
			pushToStack(dummyNode);
			
		}
	}			
	else if(strcmp(currentNode->token, "<OUT>") == 0){
		if(strcmp(currentNode->child[2]->token, "\"") == 0){
			for(i = 3; strcmp(currentNode->child[i]->token, "\"") != 0; i++){
				if(strcmp(currentNode->child[i]->token, "\\n") == 0){
					printf("\n");
				}
				else if(strcmp(currentNode->child[i]->token, "\\s") == 0){
					printf(" ");
				}
				else{
					printf("%s ", currentNode->child[i]->token);
				}				
			}
		}
		else if(strcmp(currentNode->child[2]->token, "<ACTION>") == 0){
			printf("%d", executeAction(currentNode->child[2]));
		}
	}
	else if(strcmp(currentNode->token, "<TYPE>") == 0){
		strcpy(type, currentNode->child[0]->token);
	}	
	else if(strcmp(currentNode->token, "<INIT>") == 0){
		strcpy(name, currentNode->child[0]->token);
		if(currentNode->child[1] != NULL && strcmp(currentNode->child[1]->token, "<ARR>") == 0){
			newNode = initializeVarNode(executeAction(currentNode->child[1]->child[1]));
		}
		else{
			newNode = initializeVarNode(1);
		}
		
		insertToTable(newNode);
		if(currentNode->child[1] != NULL){
			if(strcmp(type, "numero") == 0){
				if(strcmp(currentNode->child[1]->token, "<ARR>") != 0){
					newNode->intValue[0] = executeAction(currentNode->child[2]);
				}
			}			
		}
	}
	else if(strcmp(currentNode->token, "<ASS>") == 0){
		strcpy(name, currentNode->child[0]->token);
		findVar(name);
		if(strcmp(q->type, "numero") == 0){			
			if(strcmp(currentNode->child[1]->token, "<ARR>") == 0){
				q->intValue[executeAction(currentNode->child[1]->child[1])] = executeAction(currentNode->child[3]);
			}
			else{
				q->intValue[0] = executeAction(currentNode->child[2]);
			}			
		}					
	}
	else if(strcmp(currentNode->token, "<IN>") == 0){
		findVar(currentNode->child[2]->token);
		if(strcmp(q->type, "numero") == 0){			
			int temp;
			scanf("%d", &temp);
			if(currentNode->child[1] != NULL && strcmp(currentNode->child[3]->token, "<ARR>") == 0){
				q->intValue[executeAction(currentNode->child[3]->child[1])] = temp;
			}
			else{
				q->intValue[0] = temp;
			}			
		}
		else if(strcmp(q->type, "karakter") == 0){			
			scanf("%s", temp);
			strcpy(q->charValue, temp);			
		}	
	}
	else if(strcmp(currentNode->token, "<FILE>") == 0){
		char filename[LEN] = "", path[LEN] = "output/";
		strcat(path, temp);
		fp = fopen(path, "w");
	}
	else if(strcmp(currentNode->token, "<FILE_OUT>") == 0){
		if(strcmp(currentNode->child[2]->token, "\"") == 0){
			for(i = 3; strcmp(currentNode->child[i]->token, "\"") != 0; i++){
				if(strcmp(currentNode->child[i]->token, "\\n") == 0){
					fprintf(fp, "\n");
				}
				else if(strcmp(currentNode->child[i]->token, "\\t") == 0){
					fprintf(fp, "\t");
				}
				else if(strcmp(currentNode->child[i]->token, "\\s") == 0){
					fprintf(fp, " ");
				}
				else{
					fprintf(fp, "%s ", currentNode->child[i]->token);
				}				
			}
		}
		else if(strcmp(currentNode->child[2]->token, "<ACTION>") == 0){
			fprintf(fp, "%d", executeAction(currentNode->child[2]));
		}
	}	
}

//traverses the parse tree in a recursive manner
void executeTree(node *currentNode){
	int i;
	executeNode(currentNode);
	for(i = 0; i < currentNode->noOfChild; i++){
		executeTree(currentNode->child[i]);
	}
}