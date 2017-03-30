#include "syn.h"
/*
Notes:
	*program is not final, can be subjected to many changes
	*<VAR> is considered <alphabet> (for now)
	*grammar needs a lot of fix
*/
void main(){
	head = NULL;
	tail = NULL;
	p = NULL;
	line_no = 1;
	id = 0;
	error = 0;
	storeTokens();
	id = 0;	
	CODE();
	if(!error){
		printList();
		createForest();
		printf("Successfully created tree.txt & array.txt!\n");
	}
	clearNodes();
}


