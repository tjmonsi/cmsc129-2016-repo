#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define PATH_LENGTH 50
#define WORD_LENGTH 20

int argumentCheck(int argumentNumber);
int fileCheck(char filename[], char path[]);
void lexicalAnalyzer(char filename[], char path[]);
void resetFlags();
int isSymbol(char c);
void printKeyword(char word[WORD_LENGTH], FILE *fp2);

//boolean implementation for c
typedef enum boolean{
    false,
    true
}bool;

//structure containing the flags to be used
typedef struct{
	bool number;
	bool alphabet;
	bool any;
}flags;

//checks if there are arguments included
int argumentCheck(int argumentNumber){
	if(argumentNumber > 1){
		return true;
	}
	else{	
		return false;	
	}
}

//checks if the file exists
int fileCheck(char filename[], char path[]){
	FILE *fp, *fp2;
	strcpy(path, "codes/");
	strcat(path, filename);
	fp = fopen(path, "r");
	if(fp != NULL){
		fclose(fp);
		return true;
	}
	else{
		printf("File does not exist.\n");
		fp2 = fopen("output/tokens.txt", "w");
		fclose(fp2);
		return false;
	}
}

//lexical analysis thru the abstraction of a DFA
void lexicalAnalyzer(char filename[], char path[]){
	FILE *fp, *fp2;
	char word[WORD_LENGTH], current;	
	int n;
	flags is;

	resetFlags(&is);
	fp = fopen(path, "r");
	fp2 = fopen("output/tokens.txt", "w");
	fprintf(fp2, "%s\n", filename);

	for(n = 0; 1; n++){
		current = getc(fp);
		if( (current >= 'a' && current <= 'z') || (current >= 'A' && current <= 'Z') ){
			is.alphabet = true;
		}
		else if((current >= '0' && current <= '9') || current == '-'){
			if(current == '-' && is.number){
				is.any = true;
			}
			is.number = true;
		}
		else if( isSymbol(current) ){
			word[n] = '\0';	
			n = -1;			
			if(is.any || (is.alphabet && is.number)){
				fprintf(fp2, "<any> ");
				fprintf(fp2, "%s ", word);
			}
			else if(is.alphabet){
				printKeyword(word, fp2);
			}
			else if(is.number){
				fprintf(fp2, "<number> ");
				fprintf(fp2, "%s ", word);
			}
			if(current == -1){
				break;
			}	
			fprintf(fp2, "%c ", current);
			resetFlags(&is);	
		}	
		else{
			is.any = true;
		} 
		if(n != -1){
			word[n] = current;		
		}
	 }
	printf("===============================\n");
	printf("Successfully created token.txt.\n");
	printf("===============================\n");
	fclose(fp); 
	fclose(fp2);		
}

//resets the flags to false
void resetFlags(flags *is){
	is->number = false;
	is->alphabet = false;
	is->any = false;
}

//checks if symbol is included as a terminal
int isSymbol(char c){
	switch(c){		
		case ' ':
		case '\t':
		case '\n':
		case '"':
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
			return true;
		default:
			return false;		
	}
}

//prints the string as it is if it is a keyword, <alphabet> otherwise
void printKeyword(char word[WORD_LENGTH], FILE *fp2){
	if( strcmp(word, "simula") == 0 ||
		strcmp(word, "tapos") == 0 ||
		strcmp(word, "isulat") == 0 ||
		strcmp(word, "ikuha") == 0 ||
		strcmp(word, "plas") == 0 ||
		strcmp(word, "maynus") == 0 ||
		strcmp(word, "dibayd") == 0 ||
		strcmp(word, "multiplay") == 0 ||
		strcmp(word, "modyulo") == 0 || 
		strcmp(word, "at") == 0 || 
		strcmp(word, "o") == 0 || 
		strcmp(word, "hinde") == 0 || 
		strcmp(word, "masmalaki") == 0 || 
		strcmp(word, "masmaliit") == 0 || 
		strcmp(word, "parehas") == 0 || 
		strcmp(word, "hindeRehas") == 0 || 
		strcmp(word, "lakiRehas") == 0 || 
		strcmp(word, "liitRehas") == 0 || 
		strcmp(word, "truw") == 0 || 
		strcmp(word, "pols") == 0 || 
		strcmp(word, "haba") == 0 || 
		strcmp(word, "dugtong") == 0 || 
		strcmp(word, "numero") == 0 || 
		strcmp(word, "karakter") == 0 || 
		strcmp(word, "bulyan") == 0 ||
		strcmp(word, "lutang") == 0 || 
		strcmp(word, "payl") == 0 || 
		strcmp(word, "panksyon") == 0 || 
		strcmp(word, "ibigay") == 0 || 
		strcmp(word, "habang") == 0 || 
		strcmp(word, "gawin") == 0 || 
		strcmp(word, "por") == 0 || 
		strcmp(word, "kung") == 0 || 
		strcmp(word, "kungHinde") == 0 || 
		strcmp(word, "eKung") == 0 ||
		strcmp(word, "noysknap") == 0 || 
		strcmp(word, "gnabah") == 0 || 
		strcmp(word, "rop") == 0 || 
		strcmp(word, "gnuk") == 0 || 
		strcmp(word, "gnuKe") == 0 || 
		strcmp(word, "edniHgnuk") == 0 ||
		strcmp(word, "isulatSaPayl") == 0 || 
		strcmp(word, "ikuhaSaPayl") == 0 ||
		strcmp(word, "random") == 0 || 
		strcmp(word, "parigat") == 0){
		fprintf(fp2, "%s ", word);
	} 		
	else{
		fprintf(fp2, "<alphabet> ");
		fprintf(fp2, "%s ", word);
	}
}



