//References:
//http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
//https://nodejs.org/docs/latest/api/fs.html

/*[Rev 1]
	Fixed '"' and "'" ambiguity; 
	Supports escape character '\';
	Added "if", "else", "continue" and "break"
	Can determine type during token analysis
*/

/*
	Content Tree:
	Classes
		> State
			> addNext()
		> Globals
			> fs
			> EOF
			> SEPARATOR
			> sStart
			> tokt
	Function
		> compile()
		> newToken()
		> newKeyWord()
		> analyze()
			> outAndReset()
		> main()
			> nextStep()

*/

//---[:Dependencies
//---]

//---[:Classes
//--[State (FA State)
	//A state that contains its character, type, next characters, and if it accepts the token
	var State = function(character, accept){
		this.character = character;
		this.next = {};
		this.accept = accept;
		this.type = "unknown";
	}
	//Connects a state to this state
	State.prototype.addNext = function(state){
		var exists = (state.character in this.next);
		//console.log(exists);
		if(exists){
			if(state.accept)
				this.next[state.character].accept = state.accept;
			for (k in state.next) {
				this.next[state.character].addNext(state.next[k]);
			}
		}
		else{
			this.next[state.character] = state;
		}
	}
//--]
//--[Globals
	var fs = require("fs");					//File System (file read/write)
	var EOF = String.fromCharCode(22);		//Added character to EOF
	var IS = String.fromCharCode(26);		//Added character to EOF
	var sStart = new State(null, false)		//Starting Universal FA State

//--]
//---]

//---[:Functions
//Compiles keywords, characters, numbers, and symbols into the universal Finite State Automata
//sStart becomes the FA Starting State of a huge Finite State Automata
function compile(){

	//import all characters
	for (var i = 32; i < 127; i++) {
		newKeyWord(String.fromCharCode(i), String.fromCharCode(i));
	}

	//numbers configuration
	for (var i = 0; i < 10; i++) {
		sStart.next[i.toString()].type = "number";
		for (var j = 0; j < 10; j++) {
			sStart.next[i.toString()].addNext(sStart.next[j.toString()]);
		}
	}
	//decimals configuration
	var dec = new State(".", false);
	for (var i = 0; i < 10; i++) {
		dec.addNext(new State(i.toString(), true));
	}
	for (var i = 0; i < 10; i++) {
		sStart.next[i.toString()].addNext(dec);
	}
	//numbers after first decimal
	for (var i = 0; i < 10; i++) {
		dec.next[i.toString()].type = "number"
		for (var j = 0; j < 10; j++) {
			dec.next[i.toString()].addNext(dec.next[j.toString()]);
		}
	}
	//setup negativity
	sStart.next["-"].type = "-";
	for (var i = 0; i < 10; i++) {
		sStart.next["-"].addNext(sStart.next[i.toString()]);
	}

	//word generation (for variable names and such)
	//setup numbers after letters
	var cr = new State(null,false);
	for (var n = 0; n < 10; n++) {
		cr.next[n.toString()] = new State(n.toString(),true);
		cr.next[n.toString()].type = "variable";
	}
	//setup characters
	for (var i = 65; i <= 90; i++) {	//Capital
		sStart.next[String.fromCharCode(i)].type = "variable";
		for (var n = 0; n < 10; n++) {
			cr.next[n.toString()].addNext(sStart.next[String.fromCharCode(i)]);
			sStart.next[String.fromCharCode(i)].addNext(cr.next[n.toString()]);
		}
		for (var j = 65; j < 90; j++) {
			sStart.next[String.fromCharCode(i)].addNext(sStart.next[String.fromCharCode(j)]);
		}
	}
	for (var i = 97; i <= 122; i++) {	//Small
		sStart.next[String.fromCharCode(i)].type = "variable";
		for (var n = 0; n < 10; n++) {
			cr.next[n.toString()].addNext(sStart.next[String.fromCharCode(i)]);
			sStart.next[String.fromCharCode(i)].addNext(cr.next[n.toString()]);
		}
		for (var j = 97; j < 122; j++) {
			sStart.next[String.fromCharCode(i)].addNext(sStart.next[String.fromCharCode(j)]);
		}
	}
	for (var i = 65; i <= 90; i++) {	//Capital connect
		for (var j = 97; j <= 122; j++) {
			sStart.next[String.fromCharCode(i)].addNext(sStart.next[String.fromCharCode(j)]);
			sStart.next[String.fromCharCode(j)].addNext(sStart.next[String.fromCharCode(i)]);
		}
	}

	//String generation (gathers "[<words>,<numbers>,<symbols>]")
	var cstring = new State("\"",true);
	var cstring2 = new State("\'",true);
	cstring.type = "bad string";
	cstring2.type = "bad string";

	var esc1 = new State("\\",true);
	esc1.type = "bad string";
	var escnext = new State(null, true);
	escnext.type = "bad string";
	var esc2 = new State("\\",true);
	esc2.type = "bad string";
	var escnext2 = new State(null, true);
	escnext2.type = "bad string";

	sStart.next["\'"].accept = true;
	sStart.next["\'"].type = "bad string";
	sStart.next["\""].accept = true; 
	sStart.next["\""].type = "bad string";
	cstring.next["\'"] = new State("\'",true);
	cstring.next["\'"].type = "bad string";
	cstring.next["\""] = new State("\"",true);
	cstring.next["\""].type = "string";
	cstring2.next["\""] = new State("\"",true);
	cstring2.next["\""].type = "bad string";
	cstring2.next["\'"] = new State("\'",true);
	cstring2.next["\'"].type = "string";
	
	//Illegal / unclosed string
	cstring.next["\r"] = new State("\r", true);
	cstring.next["\r"].type = "bad string";
	cstring2.next["\r"] = new State("\r", true);
	cstring2.next["\r"].type = "bad string";
	cstring.next["\n"] = new State("\r", true);
	cstring.next["\n"].type = "bad string";
	cstring2.next["\n"] = new State("\r", true);
	cstring2.next["\n"].type = "bad string";

	sStart.next["\""] = cstring;
	sStart.next["\'"] = cstring2;
	sStart.next["\'"].addNext(cstring.next["\'"]);
	sStart.next["\""].addNext(cstring2.next["\""]);
	cstring.next["\'"].addNext(cstring.next["\'"]);
	cstring.next["\""].addNext(cstring.next["\""]);
	cstring2.next["\'"].addNext(cstring2.next["\'"]);
	cstring2.next["\""].addNext(cstring2.next["\""]);

	escnext.next["\\"] = new State("\\",true);
	escnext.next["\\"].type = "bad string";
	escnext.next["\""] = new State("\"",true);
	escnext.next["\""].type = "bad string";
	escnext.next["\'"] = new State("\'",true);
	escnext.next["\'"].type = "bad string";
	escnext2.next["\\"] = new State("\\",true);
	escnext2.next["\\"].type = "bad string";
	escnext2.next["\""] = new State("\"",true);
	escnext2.next["\""].type = "bad string";
	escnext2.next["\'"] = new State("\'",true);
	escnext2.next["\'"].type = "bad string";
	
	for (var i = 32; i <= 126; i++) {
		if(i == 34 || i == 39 || i == 92)
			continue;
		cstring.next[String.fromCharCode(i)] = new State(String.fromCharCode(i),false);
		cstring.next[String.fromCharCode(i)].type = "bad string";
		cstring2.next[String.fromCharCode(i)] = new State(String.fromCharCode(i),false);
		cstring2.next[String.fromCharCode(i)].type = "bad string";
		sStart.next["\""].addNext(cstring.next[String.fromCharCode(i)]);
		sStart.next["\'"].addNext(cstring2.next[String.fromCharCode(i)]);
		cstring.next[String.fromCharCode(i)].addNext(cstring.next["\""]);
		cstring.next[String.fromCharCode(i)].addNext(cstring.next["\'"]);
		cstring.next["\'"].addNext(String.fromCharCode(i));
		cstring2.next[String.fromCharCode(i)].addNext(cstring2.next["\'"]);
		cstring2.next[String.fromCharCode(i)].addNext(cstring2.next["\""]);
		cstring2.next["\""].addNext(String.fromCharCode(i));
	
	}

	//For escapes
	for (var i = 32; i <= 126; i++) {
		if(i == 34 || i == 39 || i == 92)
			continue;
		
		esc1.next[String.fromCharCode(i)] = new State(String.fromCharCode(i), false);
		esc1.next[String.fromCharCode(i)].type = "bad string";
		esc2.next[String.fromCharCode(i)] = new State(String.fromCharCode(i), false);
		esc2.next[String.fromCharCode(i)].type = "bad string";
		
		cstring.next[String.fromCharCode(i)].addNext(esc1);
		cstring2.next[String.fromCharCode(i)].addNext(esc2);
		cstring.next["\'"].addNext(cstring.next[String.fromCharCode(i)]);	
		cstring2.next["\""].addNext(cstring.next[String.fromCharCode(i)]);	
		escnext.next[String.fromCharCode(i)] = new State(String.fromCharCode(i), false);
		escnext.next[String.fromCharCode(i)].type = "bad string";
		escnext.next[String.fromCharCode(i)].next[String.fromCharCode(i)] = cstring.next[String.fromCharCode(i)];
		escnext2.next[String.fromCharCode(i)] = new State(String.fromCharCode(i), false);
		escnext2.next[String.fromCharCode(i)].type = "bad string";
		escnext2.next[String.fromCharCode(i)].next[String.fromCharCode(i)] = cstring2.next[String.fromCharCode(i)];
		
		for (var j = 32; j <= 126; j++) {
			if(j == 34 || j == 39 || j == 92)
				continue;
			esc1.next[String.fromCharCode(i)].next[String.fromCharCode(j)] = cstring.next[String.fromCharCode(j)];
			esc2.next[String.fromCharCode(i)].next[String.fromCharCode(j)] = cstring2.next[String.fromCharCode(j)];
			cstring.next[String.fromCharCode(i)].addNext(cstring.next[String.fromCharCode(j)]);
			cstring2.next[String.fromCharCode(i)].addNext(cstring2.next[String.fromCharCode(j)]);
		}
		
		escnext.next["\\"].next[String.fromCharCode(i)] = cstring.next[String.fromCharCode(i)];
		escnext.next["\""].next[String.fromCharCode(i)] = cstring.next[String.fromCharCode(i)];
		escnext.next["\'"].next[String.fromCharCode(i)] = cstring.next[String.fromCharCode(i)];
		escnext2.next["\\"].next[String.fromCharCode(i)] = cstring2.next[String.fromCharCode(i)];
		escnext2.next["\""].next[String.fromCharCode(i)] = cstring2.next[String.fromCharCode(i)];
		escnext2.next["\'"].next[String.fromCharCode(i)] = cstring2.next[String.fromCharCode(i)];
		
	}

	esc1.next["\\"] = escnext.next["\\"]; 
	esc1.next["\""] = escnext.next["\""]; 
	esc1.next["\'"] = escnext.next["\'"];
	esc2.next["\\"] = escnext2.next["\\"]; 
	esc2.next["\""] = escnext2.next["\""]; 
	esc2.next["\'"] = escnext2.next["\'"]; 

	escnext.next["\\"].next["\\"] = cstring.next["\\"];
	escnext.next["\\"].next["\""] = cstring.next["\""];
	escnext.next["\\"].next["\'"] = cstring.next["\'"];
	escnext.next["\""].next["\\"] = cstring.next["\\"];
	escnext.next["\""].next["\""] = cstring.next["\""];
	escnext.next["\""].next["\'"] = cstring.next["\'"];
	escnext.next["\'"].next["\\"] = cstring.next["\\"];
	escnext.next["\'"].next["\""] = cstring.next["\""];
	escnext.next["\'"].next["\'"] = cstring.next["\'"];

	escnext2.next["\\"].next["\\"] = cstring2.next["\\"];
	escnext2.next["\\"].next["\""] = cstring2.next["\""];
	escnext2.next["\\"].next["\'"] = cstring2.next["\'"];
	escnext2.next["\""].next["\\"] = cstring2.next["\\"];
	escnext2.next["\""].next["\""] = cstring2.next["\""];
	escnext2.next["\""].next["\'"] = cstring2.next["\'"];
	escnext2.next["\'"].next["\\"] = cstring2.next["\\"];
	escnext2.next["\'"].next["\""] = cstring2.next["\""];
	escnext2.next["\'"].next["\'"] = cstring2.next["\'"];
	
	cstring.next["\\"] = esc1;
	cstring2.next["\\"] = esc2;

	escnext.next["\\"] = esc1;
	escnext2.next["\\"] = esc2;

	//Keywords
	newKeyWord("true", "true");
	newKeyWord("false", "false");
	newKeyWord("var", "var");
	newKeyWord("function", "function");
	newKeyWord("print", "print");
	newKeyWord("load", "load");
	newKeyWord("return", "return");
	newKeyWord("if", "if");
	newKeyWord("else", "else");
	newKeyWord("for", "for");
	newKeyWord("do", "do");
	newKeyWord("while", "while");
	newKeyWord("null", "null");
	newKeyWord("continue", "continue");
	newKeyWord("break", "break");

	//Others
	newKeyWord("==", "==");
	newKeyWord("!=", "!=");
	newKeyWord("<=", "<=");
	newKeyWord(">=", ">=");

	//Special Symbols
	newKeyWord("//", "//");
	newKeyWord("/*", "/*");
	newKeyWord("*/", "*/");
	newKeyWord("\t", "\\s");
	newKeyWord("\r\n", "\\n");
	newKeyWord("\n", "\\n");
	sStart.next[" "].type = "\\s";

}

//Shortens the creation of tokens/lexemes
//characters of the string will form a singly-linked connection
//the last character of the string will be the accepting state
function newToken(string, type){
	var characters = string.split('');
	var states = [];
	var i;
	for (i = 0; i < characters.length-1; i++) {
		states.push(new State(characters[i],false));
	}
	var last = new State(characters[i],true);
	last.type = type;
	states.push(last);
	return states;
}

//Easily adds a new keyword to the universal FA
//adds the new token to the starting FA state 'sStart'
function newKeyWord(string, type){
	var temp = newToken(string, type);
	for (var i = 0; i < temp.length-1; i++) {
		temp[i].addNext(temp[i+1]);
	}
	sStart.addNext(temp[0]);
}

//Lexical Analysis
//Checks the text per character then finds tokens by traversing states starting at sStart
function analyze(text,filename){

	console.log("----------\nContent of \""+filename+"\":\n----------\n"+text+"\n----------");	
	console.log("analyzing...");
	var t = [];
	var tokens = [];

	for (var i = 0; i < text.length; i++)
		t.push(text[i]);
	t.push(EOF);
	
	//--[Check for lexical matches using FA State sStart]

	var line = 0;
	var tokens = []
	var token = {}
	var temp = sStart;	//start at FA Starting State 'sStart'
	var tok = [];
	var accept = false;

	function outAndReset(){	//gets the token stack and starts again at sStart
		token = tok.join('');
//		console.log(token);
		tokens.push({"token":token, "type":temp.type});
		tok = [];
		temp = sStart;
	}

	while(t.length > 0){	//until the input queue is finished
		var c = t.shift();
//		console.log(c +"; "+tok)
		if(c in temp.next){
			tok.push(c);
			temp = temp.next[c];
			accept = temp.accept;
			continue;
		}
		else{
			outAndReset();
			if(accept){
				if(c in temp.next){
					tok.push(c);
					temp = temp.next[c];
					accept = temp.accept;
					continue;
				}	
			}
		}

		var accept = false;

	}	

	return tokens;

}

//This is the main function
//checks for arguments
//reads file
function main(){

	var file = process.argv[2]
	if(file === undefined || process.argv > 3){
		console.log("Error: No file argument!\nRun \"node lex.js <.cjs file>\" (sample: node lex.js sample.cjs)");
		return
	}

	//data = read file's text
	//analyzes, displays, saves to file
	function nextStep(err, data){
		if (err) {
	    	return console.log(err);
	  	}
	  	
	  	//analyze
	  	var tokens = analyze(data,file);
	  	
	  	//display and convert
	  	console.log("----------\nlexemes:\n----------");
	  	var output = "";
	  	while(tokens.length > 0){
	  		var token = tokens.shift();
		  	var isNotNewLine = (token["token"]!="\r\n"&&token["token"]!="\n"&&token["token"]!="\r");
	  		var isNotSpace = (token["token"]!=" ");
	  		var isNotTab = (token["token"]!="\t");
	  		var nextline = (isNotNewLine?(isNotSpace?(isNotTab?(token["token"] + IS + token["type"]):("\\t"+IS+"\\s")):("\\s"+IS+"\\s")):("\\n"+IS+"\\n")) + "\n";
	  		output+=nextline;
	  	}
	  	console.log(output+"----------\n");

	  	//save to new file with similar filename + ".lex"
	  	fs.writeFile(file+".lex", output, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("Tokens compiled to "+file+".lex!");
		}); 

	}

	//reads file and does the next step
	fs.readFile(file, 'utf8', nextStep);

}

//---]

compile();
main();