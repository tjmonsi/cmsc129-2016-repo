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
		" ":97,
		"\t":98,
		"\n":99,
		"\r":99,
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
		this.type = null;
//		this.nodelim = false;
		
	}
	DNode.prototype.addNext = function(node){
		
		var exists = (node.character in this.next);
		console.log(exists);
		if(exists){
			this.next[node.character].accept = node.accept;
			for (k in node.next) {
				this.next[node.character].addNext(node.next[k]);
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
	newKeyWord(" ");
	newKeyWord("\t");
	newKeyWord("\r");
	newKeyWord("\n");
	
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
//	newKeyWord(".");
//	dStart.next["."].nodelim = true;
	newKeyWord(";");
//	dStart.next[";"].nodelim = true;

	//alphabet-Alphabet characters
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
	//numbers configuration
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
	dStart.next["0"].addNext(dStart.next["0"]);
	dStart.next["0"].addNext(dStart.next["1"]);
	dStart.next["0"].addNext(dStart.next["2"]);
	dStart.next["0"].addNext(dStart.next["3"]);
	dStart.next["0"].addNext(dStart.next["4"]);
	dStart.next["0"].addNext(dStart.next["5"]);
	dStart.next["0"].addNext(dStart.next["6"]);
	dStart.next["0"].addNext(dStart.next["7"]);
	dStart.next["0"].addNext(dStart.next["8"]);
	dStart.next["0"].addNext(dStart.next["9"]);
	dStart.next["1"].addNext(dStart.next["0"]);
	dStart.next["1"].addNext(dStart.next["1"]);
	dStart.next["1"].addNext(dStart.next["2"]);
	dStart.next["1"].addNext(dStart.next["3"]);
	dStart.next["1"].addNext(dStart.next["4"]);
	dStart.next["1"].addNext(dStart.next["5"]);
	dStart.next["1"].addNext(dStart.next["6"]);
	dStart.next["1"].addNext(dStart.next["7"]);
	dStart.next["1"].addNext(dStart.next["8"]);
	dStart.next["1"].addNext(dStart.next["9"]);
	dStart.next["2"].addNext(dStart.next["0"]);
	dStart.next["2"].addNext(dStart.next["1"]);
	dStart.next["2"].addNext(dStart.next["2"]);
	dStart.next["2"].addNext(dStart.next["3"]);
	dStart.next["2"].addNext(dStart.next["4"]);
	dStart.next["2"].addNext(dStart.next["5"]);
	dStart.next["2"].addNext(dStart.next["6"]);
	dStart.next["2"].addNext(dStart.next["7"]);
	dStart.next["2"].addNext(dStart.next["8"]);
	dStart.next["2"].addNext(dStart.next["9"]);
	dStart.next["3"].addNext(dStart.next["0"]);
	dStart.next["3"].addNext(dStart.next["1"]);
	dStart.next["3"].addNext(dStart.next["2"]);
	dStart.next["3"].addNext(dStart.next["3"]);
	dStart.next["3"].addNext(dStart.next["4"]);
	dStart.next["3"].addNext(dStart.next["5"]);
	dStart.next["3"].addNext(dStart.next["6"]);
	dStart.next["3"].addNext(dStart.next["7"]);
	dStart.next["3"].addNext(dStart.next["8"]);
	dStart.next["3"].addNext(dStart.next["9"]);
	dStart.next["4"].addNext(dStart.next["0"]);
	dStart.next["4"].addNext(dStart.next["1"]);
	dStart.next["4"].addNext(dStart.next["2"]);
	dStart.next["4"].addNext(dStart.next["3"]);
	dStart.next["4"].addNext(dStart.next["4"]);
	dStart.next["4"].addNext(dStart.next["5"]);
	dStart.next["4"].addNext(dStart.next["6"]);
	dStart.next["4"].addNext(dStart.next["7"]);
	dStart.next["4"].addNext(dStart.next["8"]);
	dStart.next["4"].addNext(dStart.next["9"]);
	dStart.next["5"].addNext(dStart.next["0"]);
	dStart.next["5"].addNext(dStart.next["1"]);
	dStart.next["5"].addNext(dStart.next["2"]);
	dStart.next["5"].addNext(dStart.next["3"]);
	dStart.next["5"].addNext(dStart.next["4"]);
	dStart.next["5"].addNext(dStart.next["5"]);
	dStart.next["5"].addNext(dStart.next["6"]);
	dStart.next["5"].addNext(dStart.next["7"]);
	dStart.next["5"].addNext(dStart.next["8"]);
	dStart.next["5"].addNext(dStart.next["9"]);
	dStart.next["6"].addNext(dStart.next["0"]);
	dStart.next["6"].addNext(dStart.next["1"]);
	dStart.next["6"].addNext(dStart.next["2"]);
	dStart.next["6"].addNext(dStart.next["3"]);
	dStart.next["6"].addNext(dStart.next["4"]);
	dStart.next["6"].addNext(dStart.next["5"]);
	dStart.next["6"].addNext(dStart.next["6"]);
	dStart.next["6"].addNext(dStart.next["7"]);
	dStart.next["6"].addNext(dStart.next["8"]);
	dStart.next["6"].addNext(dStart.next["9"]);
	dStart.next["7"].addNext(dStart.next["0"]);
	dStart.next["7"].addNext(dStart.next["1"]);
	dStart.next["7"].addNext(dStart.next["2"]);
	dStart.next["7"].addNext(dStart.next["3"]);
	dStart.next["7"].addNext(dStart.next["4"]);
	dStart.next["7"].addNext(dStart.next["5"]);
	dStart.next["7"].addNext(dStart.next["6"]);
	dStart.next["7"].addNext(dStart.next["7"]);
	dStart.next["7"].addNext(dStart.next["8"]);
	dStart.next["7"].addNext(dStart.next["9"]);
	dStart.next["8"].addNext(dStart.next["0"]);
	dStart.next["8"].addNext(dStart.next["1"]);
	dStart.next["8"].addNext(dStart.next["2"]);
	dStart.next["8"].addNext(dStart.next["3"]);
	dStart.next["8"].addNext(dStart.next["4"]);
	dStart.next["8"].addNext(dStart.next["5"]);
	dStart.next["8"].addNext(dStart.next["6"]);
	dStart.next["8"].addNext(dStart.next["7"]);
	dStart.next["8"].addNext(dStart.next["8"]);
	dStart.next["8"].addNext(dStart.next["9"]);
	dStart.next["9"].addNext(dStart.next["0"]);
	dStart.next["9"].addNext(dStart.next["1"]);
	dStart.next["9"].addNext(dStart.next["2"]);
	dStart.next["9"].addNext(dStart.next["3"]);
	dStart.next["9"].addNext(dStart.next["4"]);
	dStart.next["9"].addNext(dStart.next["5"]);
	dStart.next["9"].addNext(dStart.next["6"]);
	dStart.next["9"].addNext(dStart.next["7"]);
	dStart.next["9"].addNext(dStart.next["8"]);
	dStart.next["9"].addNext(dStart.next["9"]);
	//decimals configuration
	newKeyWord(".0");
	newKeyWord(".1");
	newKeyWord(".2");
	newKeyWord(".3");
	newKeyWord(".4");
	newKeyWord(".5");
	newKeyWord(".6");
	newKeyWord(".7");
	newKeyWord(".8");
	newKeyWord(".9");
	var dec = dStart.next["."];
	console.log(dec);
	dStart.next["0"].addNext(dec);
	dStart.next["1"].addNext(dec);
	dStart.next["2"].addNext(dec);
	dStart.next["3"].addNext(dec);
	dStart.next["4"].addNext(dec);
	dStart.next["5"].addNext(dec);
	dStart.next["6"].addNext(dec);
	dStart.next["7"].addNext(dec);
	dStart.next["8"].addNext(dec);
	dStart.next["9"].addNext(dec);
	dec.next["0"].addNext(dec.next["0"]);
	dec.next["0"].addNext(dec.next["1"]);
	dec.next["0"].addNext(dec.next["2"]);
	dec.next["0"].addNext(dec.next["3"]);
	dec.next["0"].addNext(dec.next["4"]);
	dec.next["0"].addNext(dec.next["5"]);
	dec.next["0"].addNext(dec.next["6"]);
	dec.next["0"].addNext(dec.next["7"]);
	dec.next["0"].addNext(dec.next["8"]);
	dec.next["0"].addNext(dec.next["9"]);
	dec.next["1"].addNext(dec.next["0"]);
	dec.next["1"].addNext(dec.next["1"]);
	dec.next["1"].addNext(dec.next["2"]);
	dec.next["1"].addNext(dec.next["3"]);
	dec.next["1"].addNext(dec.next["4"]);
	dec.next["1"].addNext(dec.next["5"]);
	dec.next["1"].addNext(dec.next["6"]);
	dec.next["1"].addNext(dec.next["7"]);
	dec.next["1"].addNext(dec.next["8"]);
	dec.next["1"].addNext(dec.next["9"]);
	dec.next["2"].addNext(dec.next["0"]);
	dec.next["2"].addNext(dec.next["1"]);
	dec.next["2"].addNext(dec.next["2"]);
	dec.next["2"].addNext(dec.next["3"]);
	dec.next["2"].addNext(dec.next["4"]);
	dec.next["2"].addNext(dec.next["5"]);
	dec.next["2"].addNext(dec.next["6"]);
	dec.next["2"].addNext(dec.next["7"]);
	dec.next["2"].addNext(dec.next["8"]);
	dec.next["2"].addNext(dec.next["9"]);
	dec.next["3"].addNext(dec.next["0"]);
	dec.next["3"].addNext(dec.next["1"]);
	dec.next["3"].addNext(dec.next["2"]);
	dec.next["3"].addNext(dec.next["3"]);
	dec.next["3"].addNext(dec.next["4"]);
	dec.next["3"].addNext(dec.next["5"]);
	dec.next["3"].addNext(dec.next["6"]);
	dec.next["3"].addNext(dec.next["7"]);
	dec.next["3"].addNext(dec.next["8"]);
	dec.next["3"].addNext(dec.next["9"]);
	dec.next["4"].addNext(dec.next["0"]);
	dec.next["4"].addNext(dec.next["1"]);
	dec.next["4"].addNext(dec.next["2"]);
	dec.next["4"].addNext(dec.next["3"]);
	dec.next["4"].addNext(dec.next["4"]);
	dec.next["4"].addNext(dec.next["5"]);
	dec.next["4"].addNext(dec.next["6"]);
	dec.next["4"].addNext(dec.next["7"]);
	dec.next["4"].addNext(dec.next["8"]);
	dec.next["4"].addNext(dec.next["9"]);
	dec.next["5"].addNext(dec.next["0"]);
	dec.next["5"].addNext(dec.next["1"]);
	dec.next["5"].addNext(dec.next["2"]);
	dec.next["5"].addNext(dec.next["3"]);
	dec.next["5"].addNext(dec.next["4"]);
	dec.next["5"].addNext(dec.next["5"]);
	dec.next["5"].addNext(dec.next["6"]);
	dec.next["5"].addNext(dec.next["7"]);
	dec.next["5"].addNext(dec.next["8"]);
	dec.next["5"].addNext(dec.next["9"]);
	dec.next["6"].addNext(dec.next["0"]);
	dec.next["6"].addNext(dec.next["1"]);
	dec.next["6"].addNext(dec.next["2"]);
	dec.next["6"].addNext(dec.next["3"]);
	dec.next["6"].addNext(dec.next["4"]);
	dec.next["6"].addNext(dec.next["5"]);
	dec.next["6"].addNext(dec.next["6"]);
	dec.next["6"].addNext(dec.next["7"]);
	dec.next["6"].addNext(dec.next["8"]);
	dec.next["6"].addNext(dec.next["9"]);
	dec.next["7"].addNext(dec.next["0"]);
	dec.next["7"].addNext(dec.next["1"]);
	dec.next["7"].addNext(dec.next["2"]);
	dec.next["7"].addNext(dec.next["3"]);
	dec.next["7"].addNext(dec.next["4"]);
	dec.next["7"].addNext(dec.next["5"]);
	dec.next["7"].addNext(dec.next["6"]);
	dec.next["7"].addNext(dec.next["7"]);
	dec.next["7"].addNext(dec.next["8"]);
	dec.next["7"].addNext(dec.next["9"]);
	dec.next["8"].addNext(dec.next["0"]);
	dec.next["8"].addNext(dec.next["1"]);
	dec.next["8"].addNext(dec.next["2"]);
	dec.next["8"].addNext(dec.next["3"]);
	dec.next["8"].addNext(dec.next["4"]);
	dec.next["8"].addNext(dec.next["5"]);
	dec.next["8"].addNext(dec.next["6"]);
	dec.next["8"].addNext(dec.next["7"]);
	dec.next["8"].addNext(dec.next["8"]);
	dec.next["8"].addNext(dec.next["9"]);
	dec.next["9"].addNext(dec.next["0"]);
	dec.next["9"].addNext(dec.next["1"]);
	dec.next["9"].addNext(dec.next["2"]);
	dec.next["9"].addNext(dec.next["3"]);
	dec.next["9"].addNext(dec.next["4"]);
	dec.next["9"].addNext(dec.next["5"]);
	dec.next["9"].addNext(dec.next["6"]);
	dec.next["9"].addNext(dec.next["7"]);
	dec.next["9"].addNext(dec.next["8"]);
	dec.next["9"].addNext(dec.next["9"]);	
	dec.next["0"].type = "number";
	dec.next["1"].type = "number";
	dec.next["2"].type = "number";
	dec.next["3"].type = "number";
	dec.next["4"].type = "number";
	dec.next["5"].type = "number";
	dec.next["6"].type = "number";
	dec.next["7"].type = "number";
	dec.next["8"].type = "number";
	dec.next["9"].type = "number";
	
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
	
	var tokens = checkKeyWords(t);

	console.log(tokens);

}

//Checks for 
function checkKeyWords(t){

	var tokens = []
	var token = {}
	var warning = "";
	var temp = dStart;
	var tok = [];
	var accept = false;

	function outAndReset(type){
		token = {"token":tok.join(''),"type":tokt[accept?tok.join(''):type!=null?type:"unknown"]};
		tokens.push(token);
		tok = [];
		temp = dStart;
	}

	while(t.length > 0){
		var c = t.shift();
		console.log(c)
		if(c in temp.next){
			tok.push(c);
			temp = temp.next[c];
			accept = temp.accept;
			type = temp.type;
			continue;
		}
		else{
			if(accept){
				
				outAndReset(type);

				if(c in temp.next){
					tok.push(c);
					temp = temp.next[c];
					accept = temp.accept;
					type = temp.type;
					continue;
				}	
			}
			
			else if(c == ' ' || c == '\r' || c == '\n' || c == '\t'){
				outAndReset(type);
			}
			else{
				tok.push(c);
			}
		}

		var accept = false;
		var type = null;

	}	

	return tokens;

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