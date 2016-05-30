/*
* Name: Franz Joezepf C. Dinglasan
* Student No: 2013-57046
* Section: CMSC129 EF-1L
* Date Written: March 13, 2016
* Program Descrition: Program is an implementation of a REGEX thru
* an abstraction of a DFA. DFA is implemeted thru the use of flags
* that will serve as its states. The program is a lexical analyzer
* that reads a file and outputs its tokens in the terminal.
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define FILE_LENGTH 20
#define WORD_LENGTH 20

//boolean implementation for c
enum boolean{
    false,
    true
};

//global variables used as flags
enum boolean number, alphabet, flowt, string, error, reset;

//resets above flags to false
void resetFlags(){
	number = false;
	alphabet = false;
	string = false;
	flowt = false;
	error = false;
	reset = false;
}

//returns 1 if a valid symbol, 0 otherwise
int isSymbol(char c){
	switch(c){
		case '\n':
		case ' ':
		case '(':
		case ')':
		case '[':
		case ']':
		case ':':
		case ';':
		case ',':
		case '\t':
		case '=':
			return 1;
		default:
			return 0;		
	}
}

//prints the string as it is if it is a keyword, VAR otherwise
void printKeyword(char word[WORD_LENGTH]){
	if(strcmp(word, "simula") == 0)
		printf("simula");
	else if(strcmp(word, "tapos") == 0)
		printf("tapos");
	else if(strcmp(word, "isulat") == 0)
		printf("isulat");
	else if(strcmp(word, "ikuha") == 0)
		printf("ikuha");
	else if(strcmp(word, "plas") == 0)
		printf("plas");
	else if(strcmp(word, "maynus") == 0)
		printf("maynus");
	else if(strcmp(word, "dibayd") == 0)
		printf("dibayd");
	else if(strcmp(word, "multiplay") == 0)
		printf("multiplay");
	else if(strcmp(word, "modyulo") == 0)
		printf("modyulo");
	else if(strcmp(word, "at") == 0)
		printf("at");
	else if(strcmp(word, "o") == 0)
		printf("o");
	else if(strcmp(word, "hinde") == 0)
		printf("hinde");
	else if(strcmp(word, "masmalaki") == 0)
		printf("masmalaki");
	else if(strcmp(word, "masmaliit") == 0)
		printf("masmaliit");
	else if(strcmp(word, "parehas") == 0)
		printf("parehas");
	else if(strcmp(word, "hindeRehas") == 0)
		printf("hindeRehas");
	else if(strcmp(word, "lakiRehas") == 0)
		printf("lakiRehas");
	else if(strcmp(word, "liitRehas") == 0)
		printf("liitRehas");
	else if(strcmp(word, "truw") == 0)
		printf("truw");
	else if(strcmp(word, "pols") == 0)
		printf("pols");
	else if(strcmp(word, "haba") == 0)
		printf("haba");
	else if(strcmp(word, "dugtong") == 0)
		printf("dugtong");
	else if(strcmp(word, "numero") == 0)
		printf("numero");
	else if(strcmp(word, "karakter") == 0)
		printf("karakter");
	else if(strcmp(word, "lutang") == 0)
		printf("lutang");
	else if(strcmp(word, "payl") == 0)
		printf("payl");
	else if(strcmp(word, "panksyon") == 0)
		printf("panksyon");
	else if(strcmp(word, "ibigay") == 0)
		printf("ibigay");
	else if(strcmp(word, "habang") == 0)
		printf("habang");
	else if(strcmp(word, "gawin") == 0)
		printf("gawin");
	else if(strcmp(word, "por") == 0)
		printf("por");
	else if(strcmp(word, "kung") == 0)
		printf("kung");
	else if(strcmp(word, "kungHinde") == 0)
		printf("kungHinde");
	else if(strcmp(word, "eKung") == 0)
		printf("eKung");
	else
		printf("<VAR>");
}

//prints the menu in the terminal
int menu(){
	int choice;
	printf("\n");
	printf("=== Lexical Analyzer ===\n");
	printf("[1] Start\n");
	printf("[2] Exit\n");
	printf("========================\n");
	printf("Choice: ");
	scanf("%d", &choice);
	getchar();
	return choice;
}

//abstraction of a DFA
void startFxn(){

	FILE *fp;
	char filename[FILE_LENGTH], word[WORD_LENGTH], current;
	char blank[WORD_LENGTH] = "";	
	int n = 0;

	printf("\nEnter file name: ");
	scanf("%s",filename);
	fp = fopen(filename, "r");
	resetFlags();

	if(fp == NULL) printf("\nFile name does not exist!\n");
	else{
		while(1){
			current = getc(fp);
			//if end of file is reached
			if(current == -1) break;
			//if first occurence of '"' is read
			if(!string && current == '"')
				string = true;

			else if(!string){
				//if string is alphanumeric
				if(alphabet && number)
					error = true;
				//if character is a letter
				if( (current >= 'a' && current <= 'z') || (current >= 'A' && current <= 'Z') )
					alphabet = true;
				//if character is a number
				else if(current >= '0' && current <= '9')
					number = true;		
				//if a float is not followed by a number
				else if(flowt && !number)
					error = true;	
				//if there are multiple '.' on a float
				else if(flowt && current == '.')
					error = true;		
				//if a number is followed by a '.'
				else if(number && current == '.'){
					number = false;
					flowt = true;
				}
				//if a symbol is encountered
				else if( isSymbol(current) ){
					word[n] = '\0';					

					if(error)
						printf("<ERROR>");
					else if(flowt)
						printf("<lutang>");
					else if(number)
						printf("<numero>");
					else if(alphabet)
						printKeyword(word);

					printf("%c",current);
					resetFlags();
					strcpy(word, blank);
					n = 0;
					reset = true;
				}
				//if invalid character
				else error = true;
				//prevents symbols from being stored
				if(!reset){
					word[n] = current;
					n++;	
				}
				reset = false;				
			}
			//if second instance of '"' is encountered
			else if(string && current == '"'){
				printf("<STRING>");		
				resetFlags();		
			}			
		}
		//if '"' does not have a pair
		if(string) printf("<ERROR>");		
		printf("\n");
		fclose(fp);
		exit(0);
	}
}