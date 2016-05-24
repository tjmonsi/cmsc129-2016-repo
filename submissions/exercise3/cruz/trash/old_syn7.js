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
	gRules.push(new Rule(1, "Exp", ["Term", "Exp'"]));
	gRules.push(new Rule(2, "Exp'", ["+", "Exp"]));
	gRules.push(new Rule(3, "Exp'", ["-", "Exp"]));
	gRules.push(new Rule(4, "Exp'", []));
	gRules.push(new Rule(5, "Term", ["Fact", "Term'"]));
	gRules.push(new Rule(6, "Term'", ["*", "Term"]));
	gRules.push(new Rule(7, "Term'", ["/", "Term"]));
	gRules.push(new Rule(8, "Term'", []));
	gRules.push(new Rule(9, "Fact", ["identifier"]));
	gRules.push(new Rule(10, "Fact", ["number"]));
	gRules.push(new Rule(11, "Fact", ["(","Exp",")"]));

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


function tryparse(ruleStack, lexes){

	console.log("-=======-\n",ruleStack);
	if(lexes[0] == undefined)
		return

	var temp = [];
	var next = lexes.shift();
	console.log("now",next)
	for (var i = ruleStack.length-1; i >= 0; i--) {
		
		var t = (assimilate(getRule(ruleStack[i]), next, [getRule(ruleStack[i])]));
		

		console.log("t",getShortest(t));
		if(getShortest(t) != null){
			var nrules = getShortest(t)
			for (var k = i-1; k >= 0; k--) {
				nrules.unshift(ruleStack[k]);
			}
			// temp.push(nrules);
			return tryparse(nrules,lexes)
		}
		
	}

	// console.log(getShortestArr(temp))
	// if(getShortestArr(temp) != null){
	// 	var nrules = getShortestArr(temp)
	// 	for (var k = i-1; k >= 0; k--) {
	// 		nrules.unshift(ruleStack[k]);
	// 	}
	// 	return tryparse(nrules, lexes);
	// }

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

		result = tryparse(ruleStack["stack"][0], neolexes);
		// ruleStack = 
		// neolexes = result["lexes"];
		break;

	}


	return {"seq":sequence, "err":errors};

}

function getShortestArr(arr){

	if(arr.length == 0)
		return null;
	
	var min = 9999;
	var mindex = 0;
	for (var i = 0; i < arr.length; i++) {
		if(arr[i].length < min){
			min = arr[i].length;
			mindex = i;
		}
	}

	return arr[mindex];

}

function getShortest(ruleStack){

	if(ruleStack.length == undefined)
		ruleStack = [ruleStack];

	if(ruleStack.length == 0)
		return null;
	
//	console.log(ruleStack);

	var min = 9999;
	var mindex = 0;
	for (var i = 0; i < ruleStack.length; i++) {
		if(ruleStack[i]["found"] && ruleStack[i]["stack"].length < min){
			min = ruleStack[i]["stack"].length;
			mindex = i;
		}
	}

	if(ruleStack[mindex]["found"])
		return ruleStack[mindex]["stack"];
	else
		return null
}

function getRule(id){

	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].id == id)
			return gRules[i];
	}
	return null;

}

function getRules(V){

	var rules = [];

	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].V == V)
			rules.push(gRules[i]);
	}
	
	return rules;

}

function specRule(id, term){

	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].id == id)
			if(gRules[i].rule.indexOf(term)!=-1)
				return gRules[i];

	}
	return null;


}

//The main program after compiling using lex.js
function start(){
	
	// console.log(assimilate(getRule(5), {token:'+', type:'+'}, [getRule(5)]))
	var result = check(lexemes)
	// if(result["err"].length == 0)
		// console.log(result["seq"]);

}

//---]

main();
compile();
