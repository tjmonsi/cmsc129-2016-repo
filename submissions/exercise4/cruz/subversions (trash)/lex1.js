
//---[:Classes
//--[State (FA State)
	//A state that contains its character, type, next characters, and if it accepts the token
	var State = function(character, accept){
		this.character = character;
		this.next = [];
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
	var isloaded = false;
	var failed = false;
	var sStart = new State(null, false)		//Starting Universal FA State
	var id = new State(null,false);
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

	var num = new State(null, false);
	//numbers configuration
	for (var i = 0; i < 10; i++) {
		num.next[i.toString()] = new State(i.toString(), true);
		num.next[i.toString()].type = "number";
		sStart.next[i.toString()] = num.next[i.toString()];
	}

	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			num.next[i.toString()].addNext(num.next[j.toString()]);
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

	//word generation (for identifiers and such)
	//setup numbers after letters
	var cr = new State(null,false);
	// var id = new State(null, false);
	for (var n = 0; n < 10; n++) {
		cr.next[n.toString()] = new State(n.toString(),true);
		cr.next[n.toString()].type = "identifier";
	}
	//setup characters
	for (var i = 65; i <= 90; i++) {	//Capital
		id.next[String.fromCharCode(i)] = new State(String.fromCharCode(i), true);
		id.next[String.fromCharCode(i)].type = "identifier";
		sStart.next[String.fromCharCode(i)] = (id.next[String.fromCharCode(i)]);
		for (var n = 0; n < 10; n++) {
			cr.next[String.fromCharCode(i)] = (id.next[String.fromCharCode(i)]);
			id.next[n.toString()] = (cr.next[n.toString()]);
		}
		
	}
	for (var i = 65; i <= 90; i++) 	//Capital
		for (var j = 65; j < 90; j++) 
			id.next[String.fromCharCode(i)].addNext(id.next[String.fromCharCode(j)]);
		
	for (var i = 97; i <= 122; i++) {	//Small
		id.next[String.fromCharCode(i)] = new State(String.fromCharCode(i), true);
		id.next[String.fromCharCode(i)].type = "identifier";
		sStart.next[String.fromCharCode(i)] = (id.next[String.fromCharCode(i)]);
		for (var n = 0; n < 10; n++) {
			cr.next[String.fromCharCode(i)] = (id.next[String.fromCharCode(i)]);
			id.next[n.toString()] = (cr.next[n.toString()]);
		}
	}
	for (var i = 97; i <= 122; i++) 	//Small
		for (var j = 97; j < 122; j++) 
			id.next[String.fromCharCode(i)].addNext(id.next[String.fromCharCode(j)]);
		

	

	for (var i = 65; i <= 90; i++) {	//Capital connect
		for (var j = 97; j <= 122; j++) {
			id.next[String.fromCharCode(i)].addNext(id.next[String.fromCharCode(j)]);
			id.next[String.fromCharCode(j)].addNext(id.next[String.fromCharCode(i)]);
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
	
	sStart.next["\""] = cstring;
	sStart.next["\'"] = cstring2;
	sStart.next["\'"].addNext(cstring.next["\'"]);
	sStart.next["\""].addNext(cstring2.next["\""]);
	cstring.next["\'"].addNext(cstring.next["\'"]);
	cstring.next["\""].addNext(cstring.next["\""]);
	cstring2.next["\'"].addNext(cstring2.next["\'"]);
	cstring2.next["\""].addNext(cstring2.next["\""]);
	
	escnext.next["\\"] = new State("\\",false);
	escnext.next["\\"].type = "bad string";
	escnext.next["\""] = new State("\"",false);
	escnext.next["\""].type = "bad string";
	escnext.next["\'"] = new State("\'",false);
	escnext.next["\'"].type = "bad string";
	escnext2.next["\\"] = new State("\\",false);
	escnext2.next["\\"].type = "bad string";
	escnext2.next["\""] = new State("\"",false);
	escnext2.next["\""].type = "bad string";
	escnext2.next["\'"] = new State("\'",false);
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
	esc1.next["n"] = cstring.next["n"]; 
	esc1.next["t"] = cstring.next["t"]; 
	esc1.next["\""] = escnext.next["\""]; 
	esc1.next["\'"] = escnext.next["\'"];
	esc2.next["\\"] = escnext2.next["\\"]; 
	esc2.next["n"] = cstring2.next["n"]; 
	esc2.next["t"] = cstring2.next["t"]; 
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
	newKeyWordSeq("break", "break");
	newKeyWordSeq("continue", "continue");
	newKeyWordSeq("do", "do");
	newKeyWordSeq("else", "else");
	newKeyWordSeq("for", "for");
	newKeyWordSeq("if", "if");
	newKeyWordSeq("load", "load");
	newKeyWordSeq("null", "null");
	newKeyWordSeq("print", "print");
	newKeyWordSeq("scan", "scan");
	newKeyWordSeq("return", "return");
	newKeyWordSeq("true", "true");
	newKeyWordSeq("var", "var");
	newKeyWordSeq("while", "while");
	
	//Manual setting

	function setCharacters(node, next){

		for (var n = 0; n < 10; n++) {
			node.next[n.toString()] = (id.next[n.toString()]);
		}
		for (var j = 97; j < 122; j++) {
			if(String.fromCharCode(j) == next)
				continue;
			node.next[String.fromCharCode(j)] = (id.next[String.fromCharCode(j)]);
		}
		for (var j = 65; j < 90; j++) {
			node.next[String.fromCharCode(j)] = (id.next[String.fromCharCode(j)]);
		}

	}

	//Manually setting false keyword
	var falseSet = sStart;
	var nextn;
	falseSet = falseSet.next["f"];
	
	nextn = new State("a",true);
	nextn.type = "identifier"
	falseSet.next["a"] = nextn;
	falseSet = falseSet.next["a"];
	
	setCharacters(falseSet, "l");
	nextn = new State("l",true);
	nextn.type = "identifier"
	falseSet.next["l"] = nextn;
	falseSet = falseSet.next["l"];
	
	setCharacters(falseSet, "s");
	nextn = new State("s",true);
	nextn.type = "identifier"
	falseSet.next["s"] = nextn;
	falseSet = falseSet.next["s"];
	
	setCharacters(falseSet, "e");
	nextn = new State("e",true);
	nextn.type = "false"
	falseSet.next["e"] = nextn;
	falseSet = falseSet.next["e"];
	
	setCharacters(falseSet);
	
 	falseSet = falseSet.next["f"].next["a"];
	setCharacters(falseSet, "l");
	
	//Manually setting function keyword
	var fnSet = sStart;
	var nextn;
	fnSet = fnSet.next["f"];
	
	nextn = new State("u",true);
	nextn.type = "identifier"
	fnSet.next["u"] = nextn;
	fnSet = fnSet.next["u"];
	
	setCharacters(fnSet, "n");
	nextn = new State("n",true);
	nextn.type = "identifier"
	fnSet.next["n"] = nextn;
	fnSet = fnSet.next["n"];
	
	setCharacters(fnSet, "c");
	nextn = new State("c",true);
	nextn.type = "identifier"
	fnSet.next["c"] = nextn;
	fnSet = fnSet.next["c"];
	
	setCharacters(fnSet, "t");
	nextn = new State("t",true);
	nextn.type = "identifier"
	fnSet.next["t"] = nextn;
	fnSet = fnSet.next["t"];
	
	setCharacters(fnSet, "i");
	nextn = new State("i",true);
	nextn.type = "identifier"
	fnSet.next["i"] = nextn;
	fnSet = fnSet.next["i"];
	
	setCharacters(fnSet, "o");
	nextn = new State("o",true);
	nextn.type = "identifier"
	fnSet.next["o"] = nextn;
	fnSet = fnSet.next["o"];
	
	setCharacters(fnSet, "n");
	nextn = new State("n",true);
	nextn.type = "function"
	fnSet.next["n"] = nextn;
	fnSet = fnSet.next["n"];

	
	setCharacters(fnSet);
	
 	fnSet = fnSet.next["f"].next["a"];
	setCharacters(fnSet, "l");

//	newKeyWordSeq("false", "false");
//	newKeyWordSeq("function", "function");
	
	//Others
	newKeyWord("==", "boolean");
	newKeyWord("!=", "boolean");
	newKeyWord("<=", "boolean");
	newKeyWord(">=", "boolean");

	sStart.next[">"].type = "boolean";
	sStart.next["<"].type = "boolean";

	sStart.next["+"].type = "operation";
	sStart.next["-"].type = "operation";
	sStart.next["*"].type = "operation";
	sStart.next["/"].type = "operation";
	sStart.next["%"].type = "operation";

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

//For identifier-clashing keywords
function newTokenSeq(string, type){
	var characters = string.split('');
	var states = [];
	var i;
	for (i = 0; i < characters.length-1; i++) {
		var next = new State(characters[i],true);
		next.type = "identifier";
		states.push(next);
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

//Specially made for identifier-clashing keywords
function newKeyWordSeq(string, type){
	var temp = newTokenSeq(string, type);
	var chars = string.split('');
	for (var i = 0; i < temp.length-1; i++) {
		temp[i].next[chars[i+1]] = (temp[i+1]);
		for (var n = 0; n < 10; n++) {
			temp[i].next[n.toString()] = (sStart.next[n.toString()]);
		}
		for (var j = 97; j < 122; j++) {
			if(String.fromCharCode(j) == chars[i+1])
				continue;
			temp[i].next[String.fromCharCode(j)] = (sStart.next[String.fromCharCode(j)]);
		}
		for (var j = 65; j < 90; j++) {
			temp[i].next[String.fromCharCode(j)] = (sStart.next[String.fromCharCode(j)]);
		}
	}

	for (var n = 0; n < 10; n++) {
		temp[temp.length-1].next[n.toString()] = (sStart.next[n.toString()]);
	}	
	for (var j = 97; j < 122; j++) {
		temp[temp.length-1].next[String.fromCharCode(j)] = (sStart.next[String.fromCharCode(j)]);
	}
	for (var j = 65; j < 90; j++) {
		temp[temp.length-1].next[String.fromCharCode(j)] = (sStart.next[String.fromCharCode(j)]);
	}

	sStart.next[chars[0]] = (temp[0]);

}

//Lexical Analysis
//Checks the text per character then finds tokens by traversing states starting at sStart
function analyze(text,filename){

	// console.log("----------\nContent of \""+filename+"\":\n----------\n"+text+"\n----------");	
	// console.log("analyzing...");
	// console.log("----------\n");
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

			var prevc = null;
			if(temp.type == "bad string"){
				if(c == '\n' || c == '\r')
					prevc = c;
			}
			else if(temp.type == "unknown")
				prevc = c;

			outAndReset();

			if(prevc != null){
				temp = temp.next[prevc];
				accept = temp.accept;
				tok.push(prevc);
			}

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
exports.main = function(file){

	if(file === undefined){
		console.log("Error: No file argument!\nRun \"node lex.js <.cjs file>\" (sample: node lex.js sample.cjs)");
		failed = true;
		return;
	}

	//data = read file's text
	//analyzes, displays, saves to file
	function nextStep(err, data){
		if (err) {
	    	return console.log(err);
	  	}
	  	
	  	//analyze
	  	var tokens = analyze(data,file);
	  	finout = tokens;
	  	isloaded = true;

	}

	//reads file and does the next step
	fs.readFile(file, 'utf8', nextStep);

}

exports.getLexemes = () => finout;

exports.loaded = () => isloaded;

exports.failed = () => failed;

//---]

compile();


console.log(sStart.next["b"].next["2"])
