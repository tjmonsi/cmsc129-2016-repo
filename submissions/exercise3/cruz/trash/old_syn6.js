//---[:Dependencies

//Gets the tokens from the file using lex.js
const lex = require("./lex.js");
{lex.main(process.argv[2])};

//---]

//---[:Classes

	var Rule = function(id, V, rule, name){
		this.id = id;
		this.root = V;
		this.rule = rule;
		this.name = name;
	}

//--[Globals
var lexemes;			//contains the loaded tokens using lex.js
var gRules;				//array of grammar rules
var gStart;				//Start of grammar rule
//--]
//---]

//---[:Functions

//Loads and waits for the tokens using the lex.js 
function main(){

	var int1 = setInterval(function(){

		if(lex.loaded()){
			getLexemes();
			clearInterval(int1);
		}else if(lex.failed()){
			clearInterval(int1);
			clearInterval(int2);
		}

	}, 1);

	var int2 = setInterval(function(){

		if(lexemes != undefined){
			start();
			clearInterval(int2);
		}

	},1);

	function getLexemes(){
		lexemes = lex.getLexemes();
	}

}

//compile grammar rules
function compile(){

	gRules = [];
	gStart = new Rule(0, "S", ["Exp"], "Start");
	gRules.push(gStart);

	//Grammar for Mathematical Expression
	gRules.push(new Rule(1, "Exp", ["Term"], "ExpTerm"));
	gRules.push(new Rule(2, "Exp", ["Term", "+", "Exp"], "TermAddExp"));
	gRules.push(new Rule(3, "Exp", ["Term", "-", "Exp"], "TermSubExp"));
	gRules.push(new Rule(4, "Term", ["Fact"], "TermFact"));
	gRules.push(new Rule(5, "Term", ["Fact", "*", "Term"], "FactMTerm"));
	gRules.push(new Rule(6, "Term", ["Fact", "/", "Term"], "FactIdentifier"));
	gRules.push(new Rule(7, "Fact", ["identifier"], "FactIdentifier"));
	gRules.push(new Rule(8, "Fact", ["number"], "FactNumber"));
	gRules.push(new Rule(9, "Fact", ["(", "Exp", ")"], "FactParExp"));

}

function findPermute(rule, candidates){



}

function derive(rule){

	var candidates = [rule.length][];

	for (var i = 0; i < rule.length; i++) {
		
		var current = getRule(rule[i]);
		while(current)

	}

}

function findCandidate(rule, next){

	var temp = getRule(next);
	if(temp != null)
		rule.push(temp)

	console.log(rule);

	temp = null;
	if(temp != null)
		return [temp, rule];

	return [null, rule];

}

//Uses a parse tree for checking correct placements
function check(lexemes){
	var errors = [];
	var sequence = [];
	var neolexes = []; //Lexemes without whitespace

	//Remove whitespaces
	while(lexemes.length > 0){
		var tok = lexemes.shift();
		if(tok["type"] != "\\s")
			neolexes.push(tok);
	}

	var i = 0;
	var set = [];
	var candidates = [];
	while(neolexes.length > 0){
		var tok = neolexes.shift();
		console.log(tok);
		var temp = findCandidate(set, tok.type);
		set = temp[1];
		console.log("candidates:", temp[0])
		if(temp[0] != null)
			candidates.push(temp[0]);

	}

	console.log(candidates);

	return {"seq":sequence, "err":errors};

}

function getRule(type){

	//check for solos
	for (var i = 0; i < gRules.length; i++) {
		var next = gRules[i]
		if(next.rule.length>1)
			continue;
		if(next.rule[0] == type)
			return next
	}

	//check for inbetweens
	for (var i = 0; i < gRules.length; i++) {
		var next = gRules[i]
		if(next.rule.length==1)
			continue;
		if(next.rule.indexOf(type)!=-1)
			return next
	}

	return null;

}

//The main program after compiling using lex.js
function start(){
		
	var result = check(lexemes)
	// if(result["err"].length == 0)
		// console.log(result["seq"]);

}

//---]

main();
compile();
