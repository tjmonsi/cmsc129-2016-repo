//References:
//http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
//https://nodejs.org/docs/latest/api/fs.html

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
//		this.prev = null;
		this.character = character;
		this.next = {};
		this.accept = accept;
		this.type = null;
	}
	//Connects a state to this state
	State.prototype.addNext = function(state){	
		var exists = (state.character in this.next);
		//console.log(exists);
		if(exists){
			if(state.type != null)
				this.type = state.type;
			if(state.accept)
				this.next[state.character].accept = state.accept;
			for (k in state.next) {
				this.next[state.character].addNext(state.next[k]);
			}
		}
		else{
			this.next[state.character] = state;
			if(state.type != null)
				this.type = state.type;
//			state.prev = this;
		}
	}
//--]
//--[Globals
	var fs = require("fs");					//File System (file read/write)
	var EOF = String.fromCharCode(22);		//Added character to EOF
	var SEPARATOR = String.fromCharCode(26);//Character that separates lexemes from its types (for io)
	var sStart = new State(null, false)		//Starting Universal FA State
	var tokt = {							//all possible token (lexeme) types
		"null":-1,
		"unknown":0,
		"number":1,
		"word":2,
		"true":3,
		"false":4,
		
		";":10,
		".":11,
		"(":12,
		")":13,
		"[":14,
		"]":15,
		"{":16,
		"}":17,

		"=":20,
		"!":21,
		"*":22,
		"/":23,
		"+":24,
		"-":25,
		"%":26,
		
		"==":30,
		"<":31,
		">":32,
		"<=":33,
		">=":34,
		"!=":35,

		"\"":40,
		"\'":41,
		" ":42,
		"\t":43,
		"\n":44,
		"\r":44,
		"line-comment":45,
		"ml-comment-open":46,
		"ml-comment-close":47,
		
		"var":50,
		"function":51,
		"return":52,
		"do":53,
		"while":54,
		"for":55,
		"print":56,
		"load":56,
		
	}

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
		sStart.next[i.toString()].type="number";
		for (var j = 0; j < 10; j++) {
			sStart.next[i.toString()].addNext(sStart.next[j.toString()]);
		}
	}
	//decimals configuration
	for (var i = 0; i < 10; i++) {
		sStart.next[i.toString()].type="number";
		newKeyWord("."+i.toString(),"number");
	}
	sStart.next["."].accept=true;
	//first decimal
	var dec = sStart.next["."];
	for (var i = 0; i < 10; i++) {
		sStart.next[i.toString()].addNext(dec);	
		dec.next[i.toString()].type="number";
	}
	//numbers after first decimal
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			dec.next[i.toString()].addNext(dec.next[j.toString()]);
		}
	}
	//setup negativity
	sStart.next["-"] = new State("-",false);
	for (var i = 0; i < 10; i++) {
		sStart.next["-"].addNext[i.toString()];
	}

	//word generation
	for (var i = 65; i <= 90; i++) {	//Capital
		for (var j = 65; j < 90; j++) {
			sStart.next[String.fromCharCode(i)].addNext(sStart.next[String.fromCharCode(j)]);
		}
		sStart.next[String.fromCharCode(i)].type = "word";
	}
	for (var i = 97; i <= 122; i++) {	//Small
		for (var j = 97; j < 122; j++) {
			sStart.next[String.fromCharCode(i)].addNext(sStart.next[String.fromCharCode(j)]);
		}
		sStart.next[String.fromCharCode(i)].type = "word";
	}
	for (var i = 65; i <= 90; i++) {	//Capital connect
		for (var j = 97; j <= 122; j++) {
			sStart.next[String.fromCharCode(i)].addNext(sStart.next[String.fromCharCode(j)]);
			sStart.next[String.fromCharCode(j)].addNext(sStart.next[String.fromCharCode(i)]);
		}
	}

	//Keywords
	newKeyWord("var", "var");
	newKeyWord("function", "function");
	newKeyWord("print", "print");
	newKeyWord("load", "load");
	newKeyWord("return", "return");
	newKeyWord("for", "for");
	newKeyWord("do", "do");
	newKeyWord("while", "while");
	newKeyWord("true", "true");
	newKeyWord("false", "false");
	newKeyWord("null", "null");

	//Others
	newKeyWord("==","==");
	newKeyWord("!=","!=");
	newKeyWord("<=","<=");
	newKeyWord(">=",">=");

	//Special Symbols
	newKeyWord("//","line-comment");
	newKeyWord("/*","ml-comment-open");
	newKeyWord("*/","ml-comment-close");
	newKeyWord("\t","\t");
	newKeyWord("\r\n","\n");
	newKeyWord("\n","\n");

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

	console.log("----------\nContent of \""+filename+"\":\n----------\n"+text+"\n----------\n");	
	
	var t = [];
	var tokens = [];
	var warnings = [];

	for (var i = 0; i < text.length; i++)
		t.push(text[i]);
	t.push(EOF);
	
	//--[Check for lexical matches using FA State sStart]

	var line = 0;
	var tokens = []
	var token = {}
	var warning = "";
	var temp = sStart;	//start at FA Starting State 'sStart'
	var tok = [];
	var accept = false;
	var type;

	function outAndReset(type){	//gets the token stack and starts again at sStart
	//	token = {"token":tok.join(''),"type":tokt[accept?type:"unknown"]};
		var isNotNewLine = (type != "\r" && type != "\n");
  		var isNotSpace = (type != " ");
  		var isNotTab = (type != "\t");
  		token = {"token":tok.join(''),"type":accept?(isNotNewLine?(isNotSpace?(isNotTab?type:"/t"):"/s"):"/n"):"unknown"};
		tokens.push(token);
		tok = [];
		temp = sStart;
	}

	while(t.length > 0){	//until the input queue is finished
		var c = t.shift();
//		console.log(c)
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
			else{
				tok.push(c);
			}
		}

		var accept = false;
		type = null;

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
	  	console.log("----------\ntokens:\n----------");
	  	var output = "";
	  	while(tokens.length > 0){
	  		var token = tokens.shift();
		  	var isNotNewLine = (token["token"]!="\r\n"&&token["token"]!="\n"&&token["token"]!="\r");
	  		var isNotSpace = (token["token"]!=" ");
	  		var isNotTab = (token["token"]!="\t");
	  		var isUnknown = token["token"]=="unknown";
	  		var nextline = (isNotNewLine?(isNotSpace?(isNotTab?(isUnknown?"unknown":token["token"]):"/t"):"/s"):"/n") + SEPARATOR + token["type"] + "\n";
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