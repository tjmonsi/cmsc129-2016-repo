#include "lexical_analyzer.h"

int main(int argc, char *argv[]){
	if( argumentCheck(argc) )
		if( fileCheck(argv[1], argv[0]) ){
			lexicalAnalyzer(argv[1], argv[0]);
		}
	return 0;
}