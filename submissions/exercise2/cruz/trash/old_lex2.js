//http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
//https://www.npmjs.com/package/filereader

/*
	Contents:
	
	

*/

//---[:Dependencies
//--[FileAPI
	var FileAPI = require('file-api')
	  , File = FileAPI.File
	  , FileList = FileAPI.FileList
	  , FileReader = FileAPI.FileReader
	  ;
//--]
//--[Globals
	var tokt = {
		"unknown":0,
		"number":1,
		"character":2,
		"var":3,
		"=":4,
		"(":5,
		")":6,
		"[":7,
		"]":8,
		"{":9,
		"}":10,
		"==":12,
		"<":12,
		">":13,
		"<=":14,
		">=":15,
		"!=":16,
		"!":17,
		"*":18,
		"/":19,
		"+":20,
		"-":21,
		"%":22,
		"print":23,
		"return":24,
		"arrlen":25,
		"strlen":26,
		"strcat":27,
		"do":28,
		"while":29,
		"for":30,
		"true":31,
		"false":32,
		";":33,
		"function":34,
		".":35,
		"\"":36,
		"\'":37,
		"newline":99,
	}
	
	//Conditions
	function isnum(c){
		c = c.charCodeAt(0);
		return (c >= 48 && c <= 57);
	}
	function ischar(c){
		c = c.charCodeAt(0);
		return ((c >= 97 && c <= 122)||(c >= 65 && c <= 90));
	}
		
//--]
//---]

//---[:Classes
//--[DNode (DFA Node)
	var DNode = function(character, accept){
		this.head = null;
		this.character = character;
		this.next = {};
		this.accept = accept;
//		this.nodelim = false;
		
	}
	DNode.prototype.addNext = function(node){
		
		var exists = (node.character in this.next);
		if(exists){
			if(node.accept)
				this.next[node.character].accept = true;
			for (var j = 0; j < node.next.length; j++) {
				this.next[node.character].addNext(node.next.shift());
			}
		}
		else{
			this.next[node.character] = node;
			node.head = this;
		}
	}
//--]
//--[Main DFA Node (Start)
	var dStart = new DNode(null, false)
//--]
//---]

//---[:Functions
//compiles keywords into the universal FA
function compile(){

	//Var
	newKeyWord("var");
	//function
	newKeyWord("function");
	//print
	newKeyWord("print");

	//Symbols and operators
	newKeyWord("(");
	newKeyWord(")");
	newKeyWord("[");
	newKeyWord("]");
	newKeyWord("{");
	newKeyWord("}");
	newKeyWord("=");
//	dStart.next["="].nodelim = true;
	newKeyWord("\"");
//	dStart.next["\""].nodelim = true;
	newKeyWord(".");
//	dStart.next["."].nodelim = true;
	newKeyWord(";");
//	dStart.next[";"].nodelim = true;

	//alphabet-Alphabet
	newKeyWord("a");
	newKeyWord("b");
	newKeyWord("c");
	newKeyWord("d");
	newKeyWord("e");
	newKeyWord("f");
	newKeyWord("g");
	newKeyWord("h");
	newKeyWord("i");
	newKeyWord("j");
	newKeyWord("k");
	newKeyWord("l");
	newKeyWord("m");
	newKeyWord("n");
	newKeyWord("o");
	newKeyWord("p");
	newKeyWord("q");
	newKeyWord("r");
	newKeyWord("s");
	newKeyWord("t");
	newKeyWord("u");
	newKeyWord("v");
	newKeyWord("w");
	newKeyWord("x");
	newKeyWord("y");
	newKeyWord("z");
	newKeyWord("A");
	newKeyWord("B");
	newKeyWord("C");
	newKeyWord("D");
	newKeyWord("E");
	newKeyWord("F");
	newKeyWord("G");
	newKeyWord("H");
	newKeyWord("I");
	newKeyWord("J");
	newKeyWord("K");
	newKeyWord("L");
	newKeyWord("M");
	newKeyWord("N");
	newKeyWord("O");
	newKeyWord("P");
	newKeyWord("Q");
	newKeyWord("R");
	newKeyWord("S");
	newKeyWord("T");
	newKeyWord("U");
	newKeyWord("V");
	newKeyWord("W");
	newKeyWord("X");
	newKeyWord("Y");
	newKeyWord("Z");
	//numbers
	newKeyWord("0");
	newKeyWord("1");
	newKeyWord("2");
	newKeyWord("3");
	newKeyWord("4");
	newKeyWord("5");
	newKeyWord("6");
	newKeyWord("7");
	newKeyWord("8");
	newKeyWord("9");

	console.log(dStart.next['v']);		

}

//Shortens the creation of tokens
function newToken(string){
	var characters = string.split('');
	var nodes = [];
	var i;
	for (i = 0; i < characters.length-1; i++) {
		nodes.push(new DNode(characters[i],false));
	}
	nodes.push(new DNode(characters[i],true));
	
	return nodes;
}

function newKeyWord(string){
	var temp = newToken(string);
	for (var i = 0; i < temp.length-1; i++) {
		temp[i].addNext(temp[i+1]);
	}
	dStart.addNext(temp[0]);
}

//Lexical Analysis
//Checks the text per character then finds tokens by state
function analyze(text,filename){

	console.log("----------\nContent of \""+filename+"\":\n----------\n"+text+"\n----------\n");	
	
	var t = [];
	var tokens = [];
	var warnings = [];

	for (var i = 0; i < text.length; i++)
		t.push(text[i]);
	
	while(t.length > 0){

		var temp = checkKeyWords(t);
		t = temp["text"];
		tokens.push(temp["token"]);
		warnings.push(temp["warning"]);

	}

	console.log(tokens);

}

//Checks for 
function checkKeyWords(t){

	var tokens = []
	var token = {}
	var warning = "";
	var temp = dStart;
	var tok = [];
	var build = false;
	var accept = false;

	function outAndReset(){
		if(accept){
			token = {"token":tok.join(''),"type":tokt[(tok in tokt)?tok:"unknown"]};
			tokens.push({"text":t, "token":token, "warning":warning});
			temp = dStart;
		}
	}

	while(t.length > 0){
		var c = t.shift();

		while(c==' '||c=='\t'){
			c = t.shift();
			if(build){
				outAndReset();
				continue;
			}
		}

		if(c=='\r'){
			if(build){
				outAndReset();
			}
			
			token = {"token":"\n","type":tokt['newline']};
			tokens.push({"text":t, "token":token, "warning":warning});
			continue;

		}
		else if(c=='\n'){
			if(build){
				outAndReset();
			}
			
			token = {"token":"\n","type":tokt['newline']};
			tokens.push({"text":t, "token":token, "warning":warning});
			continue;
			
		}
		else if(c in temp.next){
			build = true;
			tok.push(c);
			temp = temp.next[c];
			accept = temp.accept;
		}
		else{
			if(build){
				outAndReset();
			}
			
			

			continue;
			
		}

		var accept = false;

	}	

}

//This is the main function
function main(){

	var file = process.argv[2]
	if(file === undefined || process.argv > 3){
		console.log("Error: No file argument!\nRun \"node lex.js <.cjs file>\" (sample: node lex.js sample.cjs)");
		return
	}
	var reader = new FileReader();

	reader.onload = function(e) {
		input = reader.result;
		analyze(input, file);
	}

	reader.readAsText(new File(file));

}

//---]


compile();
main();