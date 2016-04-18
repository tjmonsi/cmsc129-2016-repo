//---[:Dependencies

//Gets the tokens from the file using lex.js
const lex = require("./lex.js");
{lex.main(process.argv[2])};

//---]

//---[:Classes
	
	var Rule = function(V, rule){
		this.id = nextRuleID++;
		this.root = V;
		this.rule = rule;
	}

	var TRule = function(Rule, visit){
		this.id = Rule.id;
		this.root = Rule.root;
		this.rule = Rule.rule;
		this.prev = null;	
		this.visited = visit;	
	}

	var ParseNode = function(Rule, parent){
		this.parent = parent;
		this.rule = Rule;
		this.children = this.prodChildren();
		var term;
		if(this.rule == null)
			term = null
		else
			term = inTerminals(this.rule.root)
		this.terminal = term;
		this.value = null;
	}

	ParseNode.prototype.print = function(tabs){
		
		var rule = this.rule;
		var tab = "";
		var arrow = "";
		var val = "";
		if(tabs > 0)
			arrow = "\\-- ";
		for(var i = 0; i < tabs; i++)
			tab += "    ";
		if(this.value != null)
			val = "  =>  "+this.value;
		console.log(tab+arrow+rule.root+val)
		if(this.children != null)
			for (var i = 0; i < this.children.length; i++){
				this.children[i].print(tabs+1);
			}
		

	}

	ParseNode.prototype.replace = function(PNode){
		
		this.rule = PNode.rule;
		this.parent = PNode.parent;
		this.children = PNode.children;
		this.terminal = PNode.terminal;
		this.value = PNode.value;

	}

	ParseNode.prototype.prodChildren = function(){
		
		console.log(this)
		var rule = this.rule;
		if(rule==null||rule.rule[0]=="epsilon")
			return null

		console.log("PN Rule",rule)

		var children = []
		for (var i = 0; i < rule.rule.length; i++) {
			console.log("r",rule.rule[i])
			var np = new ParseNode(getRuleE(rule.rule[i]));
			np.parent = this;
			children.push(np);
		}
//		console.log(getRuleE(rule[i]))

		return children;

	}

//--[Globals
var nextRuleID = 0;		//IDs the grammar rules
var lexemes;			//contains the loaded tokens using lex.js
var gRules;				//array of grammar rules
var gStart;				//Start of grammar rule
var tlist;				//array of terminals
var pStart;				//Start of parse Tree
var lastpos;			//last position

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

	//Setup Terminal list
	tlist = [
				"identifier",
				"number",
				"+",
				"-",
				"*",
				"/",
				")",
				"("
			];

	gRules = [];
	gStart = new Rule("S", ["epsilon"], "Start");
	gRules.push(gStart);

	pStart = new ParseNode(gStart);
	lastpos = pStart;

	//Grammar for Mathematical Expression
	gRules.push(new Rule("S", ["Exp"], "Start"));
	gRules.push(new Rule("Exp", ["Term", "Exp'"]));
	gRules.push(new Rule("Exp", ["epsilon"]));
	gRules.push(new Rule("Exp'", ["+", "Exp"]));
	gRules.push(new Rule("Exp'", ["-", "Exp"]));
	gRules.push(new Rule("Exp'", ["epsilon"]));
	gRules.push(new Rule("Term", ["Fact", "Term'"]));
	gRules.push(new Rule("Term", ["epsilon"]));
	gRules.push(new Rule("Term'", ["*", "Term"]));
	gRules.push(new Rule("Term'", ["/", "Term"]));
	gRules.push(new Rule("Term'", ["epsilon"]));
	gRules.push(new Rule("Fact", ["identifier"]));
	gRules.push(new Rule("Fact", ["epsilon"]));
	gRules.push(new Rule("Fact", ["number"]));
	gRules.push(new Rule("Fact", ["(","Exp",")"]));



}

function inTerminals(v){

	return tlist.indexOf(v)!=-1

}

function checkleftmost(node){

	var stack = [];
	console.log("RULE",node.parent)
	if(node.value != null)
		return stack;
	else if(node.terminal)
		stack.push(node);
	else if(node.rule.rule == null)
		return stack;
	else if(node.rule.rule[0] == "epsilon")
		stack.push(node);
	else{
		var tstack = [];
		for (var i = 0; i < node.children.length; i++) {
			var chstack = checkleftmost(node.children[i]);
			if(chstack.length > 0){
				for (var j = 0; j < chstack.length; j++) {
					tstack.push(chstack[j]);
				}
			}
		}

		for (var i = 0; i < tstack.length; i++) {
			stack.push(tstack[i]);
		}

	}

	return stack;

}

//gets the next node
function getNextNode(occurrence, index){

	//Find the leftmost unexpanded node/unvalued terminal
	// var stack = [];
	// var next = [pStart];
	var next = lastpos;
	console.log(next)
	if(index == undefined)
		index = 0;

	for (var i = 0; i < index; i++) {
		next = next.parent;
	}

	var stack = checkleftmost(next);
	console.log(stack[occurrence])
	if(stack[occurrence]==undefined)
		return getNextNode(occurrence, index+1)

	if(stack[occurrence].terminal || stack[occurrence].rule.rule[0] == "epsilon")
		return stack[occurrence];
	

	// while(next.length > 0){

	// 	current = next.shift();

	// 	if(current.terminal || current.rule.rule[0] == "epsilon")
	// 		return current;
	// 	else{

	// 		for (var i = 0; i < current.children.length; i++) {
	// 			next.push(current.children[i]);
	// 		}

	// 	}

	// }

	console.log("!---ERROR - No More Next Nodes---!")
	return null;

}

//Temporarily expands a node for a terminal
//Returns expansion sequence
function lookahead(current, type){

	//Create a path for type
	var seq = [];
	var next = [new TRule(current.rule, [current.rule.id])];

	while(true){
		//console.log("type",type)
		if(next.length < 0)
			break;
		current = next.shift();
		console.log(current)
		if(current == undefined)
			return undefined;

		if(current.rule[0] == type)
			break;

		//console.log("next",next)
		//console.log("!--current--!",current)
		for (var i = 0; i < current.rule.length; i++) {

		//	console.log("current root",current.root)
			var nextvars = getRulesByVariable(current.root);
		//	console.log("nextvars", nextvars)

			for (var j = 0; j < nextvars.length; j++) {
				
				if(current.visited.indexOf(nextvars[j].id)!=-1)
					continue;

				var s = current.visited;
				s.push(nextvars[j].id)
				var t = new TRule(nextvars[j], current.visited);
				t.prev = current;
				next.push(t);

		//		console.log("==T==",t)
				var nextvars2 = getRulesByVariable(t.rule[0]);
		//		console.log("nv2",nextvars2)
				for (var k = 0; k < nextvars2.length; k++) {

					// var s2 = s;
					// s2.push(nextvars2[k].id)
					var t2 = new TRule(nextvars2[k], current.visited);
					t2.prev = t;
					next.push(t2);

				}

			}


		}

	}


	if(current.rule[0] == type){
		
		//trace back up
		while(current.prev != null){
			seq.unshift(current)
			current = current.prev;
		}

	}
	else if(next == 0){
		return null;
	}

	//console.log(seq)

	return seq;


}

function expand(current, sequence){



}

//Expands a node for the terminal then place token if good
//Manipulates the tree if good
function expandFor(type, token, nextnode){

	//Get current node; check if terminal
		//True: check if type matches terminal
			//True: Insert token then set value
			//False: Warn then Panic Mode
		//False: expand to terminal until type is found
			//If expansion sequence is found: Apply expansion
			//Else: Warn then Panic Mode

	console.log("=============\n", type, "\n");
	var current = getNextNode(nextnode);
	var child = current.rule.rule[0];
	
	if(child == "epsilon"){

//		console.log("--Epsilon--", current)
	
		var expseq = lookahead(current, type)
//		console.log("SEQUENCE", expseq)

		if(expseq == undefined){
			return expandFor(type, token, nextnode+1);
		}

		if(expseq == null){
			//Panic Mode
			console.log("PANIC");
			return null;
		}
		else{

			var nextrule; //dequeue starting point
			while(expseq.length > 0){

				nextrule = expseq.shift();
//				console.log(nextrule);
				// console.log("REPLACE", current)
				current.replace(new ParseNode(getRuleByID(nextrule.id), current.parent));
				// console.log("REPLACED", current)
				current = current.children[0];

			}

			current.terminal = inTerminals(type);
			current.rule = {"root":type, "rule":null}
			current.value = token
			lastpos = current;
			
		}
		
	}

	if(current != null){

		if(current.rule == null){
//			console.log(current);
			return null;
		}

		terminal = current.rule.root;

//		console.log(type, terminal)
			
		if(type == terminal){
			//Fill current
			current.value = token;
			lastpos = current;

		}else{
			//Panic Mode
			console.log("PANIC2")
			return null;
		}

	}

}

//Uses a parse tree for checking correct placements
function check(lexemes){

	for (var i = 0; i < lexemes.length; i++) {
		
		var lex = lexemes[i];
		if(lex.type == "\\s")
			continue;
	
		expandFor(lex.type, lex.token, 0);

	}

		pStart.print(0);		


}

//finds a matching Variable rule with epsilon
function getRuleE(V){

	for (var i = 0; i < gRules.length; i++) {
//		console.log((gRules[i].root),V)
		if(gRules[i].root == V && gRules[i].rule[0] == "epsilon")
			return gRules[i];
	}
	return null;

}

function getRuleByID(id){

	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].id == id)
			return gRules[i];
	}
	return null

}

function getRulesByVariable(v){

	var rules = [];
	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].root == v)
			rules.push(gRules[i]);
	}
	return rules;

}

function getRulesByTerminal(t){

	var rules = [];
	for (var i = 0; i < gRules.length; i++) {
		if(gRules[i].rule[0] == t)
			rules.push(gRules[i]);
	}
	return rules;

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
