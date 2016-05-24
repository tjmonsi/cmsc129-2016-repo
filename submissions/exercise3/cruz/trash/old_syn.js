//---[:Dependencies

//Gets the tokens from the file using lex.js
const lex = require("./lex.js");
{lex.main(process.argv[2])};

//Gets the grammar rules
const grm = require("./grammar.js");


//---]

//---[:Classes


//--[Globals
var toks;			//contains the loaded tokens using lex.js
//--]
//---]

//---[:Functions

//Loads and waits for the tokens using the lex.js 
function main(){

	var int1 = setInterval(function(){

		if(lex.loaded()){
			getLexToks();
			clearInterval(int1);
		}else if(lex.failed()){
			clearInterval(int1);
			clearInterval(int2);
		}

	}, 1);

	var int2 = setInterval(function(){

		if(toks != undefined){
			start();
			clearInterval(int2);
		}

	},1);

	function getLexToks(){
		toks = lex.getLexemes();
	}

	
}

function getTags(){

	var tagged = [];
	temp = toks;
	var l = toks.length;
	
	//for default cases
	function dcase(tok){

		var c = tok[0].charCodeAt(0);
		if(tok.startsWith("\'")||tok.startsWith("\""))
			return "string";
		else if((c >= 65 && c <= 90) || (c >= 97 && c <= 122))
			return "word";
		//checks if number
		var isnum = true;
		var decfound = false;
		for (var i = 0; i < tok.length; i++) {
			if(tok[i] == "."){
				if(decfound)
					return "unknown";
				decfound = true;
			}
			else{
				c = tok[i].charCodeAt(0);
				if(c < 48 || c > 57)
					isnum = false;
			}
		}
		if(isnum)
			return "number";
		else if(tok == "\r\n")
			return "\n";
		else if(tok.length == 1)
			return tok;

	}

	for (var i = 0; i < l; i++) {

		var tok = toks[i];
		var tag;
		switch(tok){

			case "true":
				tag = "true";
				break;
			case "false":
				tag = "false";
				break;
			case "var":
				tag = "var";
				break;
			case "function":
				tag = "function";
				break;
			case "print":
				tag = "print";
				break;
			case "load":
				tag = "load";
				break;
			case "return":
				tag = "return";
				break;
			case "if":
				tag = "if";
				break;
			case "else":
				tag = "else";
				break;
			case "for":
				tag = "for";
				break;
			case "do":
				tag = "do";
				break;
			case "while":
				tag = "while";
				break;
			case "null":
				tag = "null";
				break;
			case "continue":
				tag = "continue";
				break;
			case "break":
				tag = "break";
				break;
			case "==":
				tag = "==";
				break;
			case "<=":
				tag = "<=";
				break;
			case ">=":
				tag = ">=";
				break;
			case "//":
				tag = "com-line";
				break;
			case "/*":
				tag = "com-start";
				break;
			case "*/":
				tag = "com-end";
				break;

			default: tag = dcase(tok);

		}

		tagged.push({"token":tok, "tag":tag})

	}

	
	return tagged;	

}

//Uses a tree and a stack for checking correct placements
function stackCheck(lexemes){
	var errors = [];
	var sequence = [];
	while(lexemes.length > 0){
		var tok = lexemes.shift();
		var complete = tok["token"];
		switch(tok["tag"]){

			default: console.log(tok)
		}

	}

	return {"seq":sequence, "err":errors};

}

//The main program after compiling using lex.js
function start(){
	
	var lexemes = getTags();
	var result = stackCheck(lexemes)
	if(result["err"].length == 0)
		console.log(result["seq"]);

}

//---]

main();
