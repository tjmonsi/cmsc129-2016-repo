#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* removespaces(char* input)                                         
{
    int i,j;
    char *output = input;
    for (i = 0, j = 0; i<strlen(input); i++,j++){
        if (input[i] != ' ' && input[i] != '\t' && input[i] != '\n')                           
            output[j] = input[i];                     
        else
            j--;                                     
    }
    output[j] = NULL;
    return output;
}
int lexeme(char* line, int lineno){
	char *dest, *split, *string = removespaces(line);
	int i;
	//For the start of the program
	if(lineno == 1){
		strncpy(dest, string, 6);
		dest[6] = NULL;
		if(strcmp(dest, "start:") != 0){
			printf("The program must start with the keyword \"start:\"\n");
		}else if(strcmp(dest, "start:") == 0){
			printf("<PROGRAMSTART>\n\n");
		}
	}else{
		//Check for variable declarations
		strncpy(dest, string, 8);
		dest[8] = NULL;
		if(strcmp(dest, "instance") == 0 && string[strlen(string)-1] == ';'){
			printf("<VARDEC>");
			strncpy(dest, string+8, strlen(line)-1);
			if (strstr(dest, "==") != NULL) {
				printf(" := instance <EQD>\n");
				printf("<EQD> := <VARNAME> == <VALUE>\n");
				split = strtok(dest, "==");
				split = strtok(NULL, "==");
				if(strtok(NULL, "==") != NULL){
					printf("One variable declaration at a time only.\n");
				}else{
					printf("<VARNAME> := <string> | <string>[<number>]\n");
					if(split[0] == '"' && split[strlen(split)-2] == '"'){
						printf("<VALUE> := \"<string>\"\n");
					}else printf("<VALUE> := <number> | <STRINGLENGTH>\n\n");
				}
				
			}else printf("\n\n");
			return;
		}
		//For output
		strncpy(dest, string, 5);
		dest[5] = NULL;
		if(strcmp(dest, "write") == 0 && string[strlen(string)-1] == ';'){
			if(string[5] == '"' && string[strlen(string)-2] == '"'){
				printf("<OUTPUT> := write \"<VALUE>\"\n");
				printf("<VALUE> := \"<string>\"\n\n");
			}else{
				printf("<OUTPUT> := write \"<VARNAME>\"\n");
				printf("<VARNAME> := <string> | <string>[<number>]\n\n");
			}
			return;
		}
		//For user input
		strncpy(dest, string, 3);
		dest[3] = NULL;
		if(strcmp(dest, "ask") == 0 && string[strlen(string)-1] == ';'){
			printf("<USERINPUT> := ASK \"<VARNAME>\"\n");
			printf("<VARNAME> := <string> | <string>[<number>]\n\n");
			return;
		}
		
		//For end of file
		strncpy(dest, string, 4);
		dest[4] = NULL;
		if(strcmp(dest, "end:") == 0){
			printf("<PROGRAMEND>\n\n");
			return -1;
		}
	}
}

