#include "interpreter.h"

int main(){
	root = NULL, varTable = NULL, tos = NULL, stack = NULL, skip = false;
	srand(time(NULL));
	getData();
	initBoolStack();
	printf("===============================\n");
	executeTree(root);
	printf("\n===============================\n");
	if(fp != NULL) fclose(fp);
	clearNodes();
	return 0;
}