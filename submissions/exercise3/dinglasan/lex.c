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
#include "lex.h"

void main(){
	while(1){
		switch( menu() ){
			case 2: exit(0); 
			case 1: startFxn();
		}
	}
}