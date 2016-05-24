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

function findStart(target){

//Add Re-rule which finds a better prod rule

	var results = [];
	
	results = (assimilate(gStart, target, [gStart.root]));
	
	//remove non-matching conditions
	var final = [];
	while(results.length > 0){
		var r = results.shift();

		if(r["found"])
			final.push(r);

	}

	// console.log(final)

	return final;

}

//uses the RHS variable's production rules to find the target
//The end variable avoids entering infinite loop
function assimilate(rule, target, end){

	// console.log("--")
	//Check rules
	var allresults = [];
	for (var i = 0; i < rule.rule.length; i++) {
		
		//duplicate a temporary infinite recursion ender
		var endt = [];
		for (var j = 0; j < end.length; j++) {
			endt.push(end[j]);
		}

		var temp = rule.rule[i];
		if(temp == target)
			return {"stack":[rule.id], "found":true};
		else if(temp.indexOf(target.type)!=-1)
			return {"stack":[rule.id], "found":true};
		else{

			var inEnd = false;

			for(var j = 0; j < end.length && !inEnd; j++){
				if(temp == end[j])
					inEnd = true;
			}

			if(inEnd){
				// console.log(rule.id, temp, "infinite");
				continue;
			}

			var candidates = [];
			for (var j = 0; j < gRules.length; j++) {
				if(temp == gRules[j].root)
					candidates.push(gRules[j]);
			}

			if(candidates.length == 0){
				// console.log(rule.id, temp, "no cand");
				continue;
			}

			var results = [];
			for (var j = 0; j < candidates.length; j++) {
			 	endt.push(candidates[j].root);
				var res = (assimilate(candidates[j], target, endt));
				if(res.length == undefined)
					results.push(res);
				for (var k = 0; k < res.length; k++) {
					results.push(res[k]);
				}

			}

			if(results.length == 0){
				// console.log(temp, "no res");
				continue;
			}

			for(var j = 0; j < results.length; j++){
				results[j]["stack"].unshift(rule.id);
			}

//			console.log(rule, target, end, results);
			
			while(results.length > 0){
				allresults.push(results.shift());
			}			

		}


	}

	if(allresults.length != 0)
		return allresults;

	return {"stack":[rule.id], "found":false};

}

function findRuleTarget(rule, target){

	var error = [];
	var candidates = [];
	console.log(target)
	//Skips the gStart node
	for (var i = rule.length-1; i >= 0; i--) {
//		console.log(rule[i]);
		
		var temp = assimilate(gRules[rule[i]], target, [gRules[rule[i]]]);
		for (var j = 0; j < temp.length; j++) {
			if(temp[j]["found"])
				candidates.push(temp[j]["stack"]);
		}

	}

	console.log(candidates);

}

function tryparse(ruleStack, lexes){

	console.log(ruleStack);

	for (var i = 0; i < ruleStack["stack"].length; i++) {
		var rule = ruleStack["stack"][i];
		console.log(rule);

		for (var j = 0; j < lexes.length; j++) {
			findRuleTarget(rule, lexes[j]);
			break;
		}
	
	}

	return [];

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
	while(neolexes.length > 0){
		var tok = neolexes.shift();
		console.log(tok);
		var result = findStart(tok["type"]);
		var ruleStack = {"stack":[], "complete":false, "token":tok};
		for(var j = 0; j < result.length; j++){
			ruleStack["stack"].push(result[j]["stack"]);
		}
		
		i++;

		result = tryparse(ruleStack, neolexes);
		// ruleStack = 
		// neolexes = result["lexes"];

		break;

	}


	return {"seq":sequence, "err":errors};

}

function getRule(id){

	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].id == id)
			return gRules[i];
	}
	return null;

}

//finds the least common production rules for stackgroup
function findLCPR(stackgroup){



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
