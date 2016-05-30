//---[:Dependencies

//Gets the tokens from the file using lex.js
const lex = require("./lex.js");
{lex.main(process.argv[2])};

//---]

//---[:Classes

	var Rule = function(id, V, rule){
		this.id = id;
		this.root = V;
		this.rule = rule;
	}

	var ParseNode = function(Rule){
		this.rule = Rule;
		this.children = this.prodChildren();
		this.complete = false;
		this.error = false;
	}

	ParseNode.prototype.print = function(tabs){
		
		var rule = this.rule;
		var tab = "";
		var arrow = "";
		if(tabs > 0)
			arrow = "\\-- ";
		for(var i = 0; i < tabs; i++)
			tab += "  ";
		console.log(tab+arrow+rule.root)
		if(this.children != null)
			for (var i = 0; i < this.children.length; i++){
				this.children[i].print(tabs+1);
			}
		

	}

	ParseNode.prototype.fix = function(type){
		
		

	}

	ParseNode.prototype.add = function(type){

		var traced = trace(type)
		console.log(traced)

	}

	ParseNode.prototype.prodChildren = function(){
		

		var rule = this.rule;
		if(rule.rule[0]=="epsilon")
			return null

		console.log("PN Rule",rule)

		var children = []
		for (var i = 0; i < rule.rule.length; i++) {
			console.log("r",rule.rule[i])
			children.push(new ParseNode(getRuleE(rule.rule[i])));
		}
		console.log(getRuleE(rule[i]))

		return children;

	}

//--[Globals
var lexemes;			//contains the loaded tokens using lex.js
var gRules;				//array of grammar rules
var gStart;				//Start of grammar rule
var pStart;				//Start of parse Tree

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
	gStart = new Rule(0, "S", ["epsilon"], "Start");
	gRules.push(gStart);

	//Grammar for Mathematical Expression
	gRules.push(new Rule(1, "S", ["Exp"], "Start"));
	gRules.push(new Rule(2, "Exp", ["Term", "Exp'"]));
	gRules.push(new Rule(3, "Exp", ["epsilon"]));
	gRules.push(new Rule(4, "Exp'", ["+", "Exp"]));
	gRules.push(new Rule(5, "Exp'", ["-", "Exp"]));
	gRules.push(new Rule(6, "Exp'", ["epsilon"]));
	gRules.push(new Rule(7, "Term", ["Fact", "Term'"]));
	gRules.push(new Rule(8, "Term", ["epsilon"]));
	gRules.push(new Rule(9, "Term'", ["*", "Term"]));
	gRules.push(new Rule(10, "Term'", ["/", "Term"]));
	gRules.push(new Rule(11, "Term'", ["epsilon"]));
	gRules.push(new Rule(12, "Fact", ["identifier"]));
	gRules.push(new Rule(13, "Fact", ["epsilon"]));
	gRules.push(new Rule(14, "Fact", ["number"]));
	gRules.push(new Rule(15, "Fact", ["(","Exp",")"]));

}


function trace(terminal, current){

	// console.log("term",terminal)

	var maxrun = 1024;
	var currun = 0;
	if(current == undefined)
		current = pStart.rule;
	var nextRules = [];
	var visited = [];
	var history = [current];
	while(terminal != current.rule[0] && currun < maxrun){
		currun++;

		// console.log("\"Current",current);
		visited.push(current.id);
		var next = getRules(current.root);
		for (var i = 0; i < next.length; i++) {
			if(visited.indexOf(next[i].id)==-1&&nextRules.indexOf(next[i])==-1){
				nextRules.push(next[i])
			}

			for (var j = 0; j < next[i].rule.length; j++) {
				var snext = getRules(next[i].rule[j]);
				for (var k = 0; k < snext.length; k++) {
					if(visited.indexOf(snext[k].id)==-1&&nextRules.indexOf(snext[k])==-1){
						snext[k]['parent'] = next[i].id;
						nextRules.push(snext[k]);
					}
				}	
			}
		}

		// console.log(nextRules)
		current = nextRules.shift();
		history.push(current)

		if(current == undefined){
			console.log("<!---ERROR---!>");
			return null
			break;
		}

	}

	// console.log("found at",current.id)
	// console.log(history)
	var c = current;
	var trace = [c];
	while(c.parent != undefined){
		for (var i = 0; i < history.length; i++) {
			if(history[i].id == c.parent)
				c = history[i]
		}
		trace.unshift(c)
	}

//	console.log(trace)

	if(currun == maxrun){
		console.log("<!---Too Many Runs---!>")
		return null;
	}

	return trace;

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

	pStart = new ParseNode(gStart)
	pStart["current"] = pStart;
	var current = gStart;
	var cp = pStart
	while(neolexes.length > 0){
	
		var tok = neolexes.shift();
		console.log(tok);
		pStart.add(tok['type'])
		
		break;

	}

	pStart.print(0);
	
//	return {"seq":sequence, "err":errors};

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

function clean(assimilated){

	var clean = [];
	for (var i = 0; i < assimilated.length; i++) {
		if(assimilated[i]["found"])
			clean.push(assimilated[i]["stack"])
	}

	return clean;

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

//finds a matching Variable rule with epsilon
function getRuleE(V){

	for (var i = 0; i < gRules.length; i++) {
		console.log((gRules[i].root),V)
		if(gRules[i].root == V && gRules[i].rule[0] == "epsilon")
			return gRules[i];
	}
	return null;

}

function getRules(V){

	var rules = [];

	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].root == V && gRules[i].rule[0]!="epsilon")
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
