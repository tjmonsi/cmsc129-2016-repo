//Colin James P. Naranjo
//CMSC129 EF-1L
//2012-29115
//EXERCISE 2
#include <stdio.h>
#include "lexical.h"

int main(){
    FILE* file = fopen("sample.txt", "r");
    char line[256];
	int linenumber = 0;
    while (fgets(line, sizeof(line), file)) {
		printf("%s", line); 
		linenumber++;
		if(lexeme(line, linenumber) == -1){
			if(fgets(line, sizeof(line), file) != NULL){
				printf("%s\n", line); 
				printf("\"end:\" keyword must be placed at the end of the program.\n");
				exit(0);
			}
		}
	}
    fclose(file);
}