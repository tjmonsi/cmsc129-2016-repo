#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define LINE_LEN 500
#define LEN 100
#define MAX_CHILD 100

//structure used to describe a node
typedef struct list{
	int id;
	int noOfChild;
	char token[LEN];
	struct list *next;
	struct list *parent;
	struct list *child[MAX_CHILD];
}node;

//global variables
node *head, *tail, *p, *root, *current, *latest;
char filename[LEN];
int id, line_no, foo, thereIsError;

//allocates a node to the memory
node * initializeNode(char word[LEN]){
	node *newNode;
	newNode = (node *) malloc(sizeof(node));
	newNode->next = NULL;
	strcpy(newNode->token, word);
	return newNode;
}

//allocates a node to the memory
node * initializeTreeNode(char word[LEN]){
	int i;
	node *newNode;
	newNode = (node *) malloc(sizeof(node));
	newNode->id = id;
	newNode->noOfChild = 0;
	strcpy(newNode->token, word);
	newNode->next = NULL;
	newNode->parent = NULL;
	for(i  = 0; i < MAX_CHILD; i++){
		newNode->child[i] = NULL;
	}
	id++;
	return newNode;
}

//inserts a node to the parse tree
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

//adds a string to the tree
void addToTree(char word[LEN]){
	node *newNode;
	newNode = initializeTreeNode(word);
	insertToTree(newNode);
}

//prints the "branches" on a file
void createBranch(FILE *fp, int size){
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

//print the a single tree on a file
void printTree(FILE *fp){
	int i, j, k;
	if(current->noOfChild != 0){
		fprintf(fp, "\n\n%s (%d)\n", current->token, current->id);
		fprintf(fp, "|\n");		
		createBranch(fp, current->noOfChild);
	}	
	for(i = 0, j = 0; i < current->noOfChild; ){
		if(j == 0 || j % 20 == 0){
			fprintf(fp, "%s (%d)", current->child[i]->token, current->child[i]->id);
			j += strlen(current->child[i]->token);
			if(current->child[i]->id <= 9){
				j += 4;
			}
			else if(current->child[i]->id >= 100){
				j += 6;
			}
			else if(current->child[i]->id >= 1000){
				j += 7;
			}
			else{
				j += 5;
			}
			i++;
		}
		else{
			fprintf(fp, " ");	
			j++;
		}			
	}	
}

//print the whole parse tree on a file
void printParseTree(){
	FILE *fp;
	fp = fopen("output/tree.txt", "w");
	fprintf(fp, "\n");
	if(!thereIsError){
		for(current = root; current != NULL; current = current->next){
			printTree(fp);
		}
		printf("===============================\n");
		printf("Successfully created tree.txt.\n");
		printf("===============================\n");
	}		
	fclose(fp);
}

//print the parse tree in array form
void printArray(){
	FILE *fp;
	fp = fopen("output/array.txt", "w");
	if(!thereIsError){
		for(current = root; current != NULL; current = current->next){
			fprintf(fp, "%s (%d) >> ", current->token, current->id);
		}	
		printf("===============================\n");
		printf("Successfully created array.txt.\n");
		printf("===============================\n");
	}	
	fclose(fp);
}

//insert a node at the end of a list
void insertAtTail(node *newNode){
	if(head != NULL) tail->next = newNode;
	else head = newNode;		
	tail = newNode;	
}

//insert a node at the front of a list
void insertAtHead(node *newNode){
	if(head != NULL) newNode->next = head->next;
	head = newNode;
}

//removes first node
void dequeueList(){
	if(head != NULL){
		p = head;
		head = head->next;
		free(p);
	}
}

//store the tokens from the output of lexical analysis on a linked list
void storeTokens(){
	FILE *fp;
	char line[LINE_LEN], *token;
	node *newNode;	
	fp = fopen("output/tokens.txt", "r");
	fscanf(fp, "%s", filename);
	while(!feof(fp)){
		fgets(line, LINE_LEN, fp);
		token = strtok(line, " ");
		while(token != NULL){			
			newNode = initializeNode(token);
			insertAtTail(newNode);	
			token = strtok(NULL, " ");
		}	
	}
	fclose(fp);
}

//returns the first node's token
char * peekList(){
	if(head != NULL) return head->token;	
	return "end of line";	
}

//deallocates all nodes from memory
void clearNodes(){
	for(p = head; head != NULL; p = head){
		head = head->next;
		free(p);
	}
	for(p = root; root != NULL; p = root){
		root = root->next;
		free(p);
	}	
}

//reports simple abnormalities on the syntax of the source code
void reportError(char e){
	switch(e){
		case 'a': printf("%s>line#%d: missing 'simula' token\n", 
		filename, line_no); break;
		case 'm': printf("%s>line#%d: missing end statement before %s\n", 
		filename, line_no, strcmp(peekList(), "\t")==0?"tab":peekList()); break;
		case 'n': printf("%s>line#%d: invalid variable or function name at %s\n", 
		filename, line_no, strcmp(peekList(), "\t")==0?"tab":peekList()); break;
		case 'p': printf("%s>line#%d: invalid or missing parameter at %s\n", 
		filename, line_no, strcmp(peekList(), "\t")==0?"tab":peekList()); break;
		case 'x': printf("%s>line#%d: invalid statement at %s\n", 
		filename, line_no, strcmp(peekList(), "\t")==0?"tab":peekList()); break;
		case 'z': printf("%s>line#%d: missing 'tapos' token\n", 
		filename, line_no); break;
		default: printf("%s>line#%d: missing '%c' before %s token\n", 
		filename, line_no, e, strcmp(peekList(), "\n")==0?"new line":strcmp(peekList(), "\t")==0?"tab":peekList());
	}
}

//returns true if the character is a delimiter
int isDelimiter(char c){
	switch(c){
		case '\n':
			return 1;
		default:
			return 0;		
	}
}

//searches the next delimiter when an error is encountered
void panicMode(){
	thereIsError = 1;
	char word[LEN];
	strcpy(word, peekList());
	while(strcmp(word, "tapos") != 0 && !isDelimiter(word[0]) && head != NULL){
		dequeueList();
		strcpy(word, peekList());			
	}
}

//returns true if the character is a symbol
int isSymbol(char c){
	switch(c){		
		case ' ':
		case '\t':
		case '\n':
		case '(':
		case ')':
		case '[':
		case ']':
		case ':':
		case ';':
		case ',':
		case '.':		
		case '=':
		case '$':	
		case -1:	
			return 1;
		default:
			return 0;		
	}
}