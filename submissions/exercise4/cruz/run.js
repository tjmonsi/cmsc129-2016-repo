var readlineSync = require('readline-sync');
var fs = require("fs");					//File System (file read/write)
var looptester = 0;

var starter = setInterval(function(){

	if(!start)
		{start = syn.checkStart()}
	else{
		clearInterval(starter);
		{synseq = JSON.parse(syn.getSeq())} 
		main();
	}

	
}, 1);

const syn = require("./syn.js");
{syn.startSyn(process.argv[2])};
var synseq;
var start = false;
var varstack = {};
var breaker = false;
var returner = false;
var retExp = null

//Table for Functions
var Table = function(fname){

	this.id = fname;
	this.actions = [];
	this.variables = {};
	this.parameters = [];

}

var Variable = function(id, value, type){

	this.id = id;
	this.type = type;
	this.array = [];
	
	if(type == "str")
		this.array = value.split("");
	
	this.value = value;

//	this.accessed = null;
	
}

Table.prototype.set = function(index, data, i, verbose, overwrite){

//	var v = this.variables[index];
	var v = varstack[index];
	if(v == undefined)
		errorTermination(0, [index]);	
	if(v.type == "nan")
		errorTermination(2, [index, this.id]);

	if(overwrite != undefined){

		v.type = data.type;
		v.value = data.value;
		v.array = data.array;

	}

	var tempval = v.array;
	var errindex;
	if(i!=null){
			
		errindex = "";
		for (var j = 0; j < i.length-1; j++) {
			
			errindex += "["+i[j]+"]";
			tempval = tempval[i[j]];
			if(tempval == null){
				console.log("SET")
				errorTermination(1, [errindex, index, this.id])
			}

		}

		// console.log(v)

		tempval[i] = data.value;

	}	
	else
		varstack[index].value = data.value;
	
	varstack[index].type = data.type;

	if(data.type == "str"){
		var split = data.value.split("");
		split.forEach(function(e,i){
			tempval[i] = e;
		});
		
	}

}

Table.prototype.get = function(index, i) {

	// var v = this.variables[index];
	var v = varstack[index];
	if(v == undefined)
		errorTermination(0, [index]);
	
	if(v.type == "nan")
		errorTermination(2, [index, this.id]);

	var value = v.value;

	if(i!=null){
		value = v.array;
		// console.log(value)
		errindex = "";
		for (var j = 0; j < i.length; j++) {
			errindex += "["+i[j]+"]";
			value = value[i[j]];
			if(value == null){
				console.log("GET", v, i)
				errorTermination(1, [errindex, index, this.id])
			}

		}

	}

	// console.log("GETVAL",value);
	return {"type":v.type, "value":value, "array":v.array};

};


var curfn = -1;
var data = [];
var fnlist = {};

var fnNotice = ["print-call", "Var-dec'", "Asg-Exp", "If", "Wh-loop", "scan-call", "len-call", "Return", "save-call"];


function main(){

	preloadfn(synseq);

	// console.log(data.get("main").value[0])
	
	runFn("main");	//fn call main

	// console.log(data.get("x"))

}

//loads all functions
function preloadfn(object){

	for(var child in object){

		if(child == "Fn-def"){

			curfn++;
			transfer(child, object[child]);

		}

		if(typeof object[child] != "string")
			preloadfn(object[child]);
		
	}
	
}


function transfer(header, object){
	
	// console.log(object)
	switch(header){

		case "Fn-def": fnadd(object);
			break;
		case "Var-dec'": return {"action":"vardec", "target":object["identifier"], "expression":makeExpression(object["Var-dec''"]["Expression"])};
			break;
		case "Asg-Exp": return {"action":"asg", "target":object["identifier"], "index":getExInd(object["Array"]), "expression":makeExpression(object["Asg-Exp'"]["Expression"])};
			break;
		case "print-call": return {"action":"print", "params":makeExParams(object["Fn-call'"]["Fn-Param"])};
			break;
		case "Expression": return {"action":"exp", "expression":makeExpression(object)};	//TODO: Simplify Expression
			break;
		case "If": return ifAction(object);
			break;
		case "Wh-loop": return whileAction(object);
			break;
		case "scan-call": return {"action":"scan","params":makeExParams(object["Fn-call'"]["Fn-Param"])};
			break;
		case "Return": return {"action":"return","expression":makeExpression(object["Expression"])};
			break;
		case "save-call": return {"action":"save","params":makeExParams(object["Fn-call'"]["Fn-Param"])};
			break;
	}

}

//Makes a easily-readable expression out from an expression tag
//Recursively creates expressions for recursive expressing of values
function makeExpression(exp, prevOp){

	// console.log("ME",exp);

	if(exp == undefined)
		return null;

	var expression = {"type":null, "value":null};
	var number = exp["Number"];
	var string = exp["string"];
	var identifier = exp["identifier"];

	if(number != undefined){

		expression["type"] = "num";
		expression["value"] = parseInt(number["number"]);
		if(number["operation"] != undefined)
			expression["value"] *= -1;

		var op = exp["Op"];
		if(op != "epsilon"){
			if(op["operation"] != undefined)
				expression["op"] = op["operation"];
			else
				expression["op"] = op["boolean"];
				
			expression["operand"] = makeExpression(op["Expression"], expression["op"]);
		}

	}else if(string != undefined){

		if(prevOp != undefined)
			if(prevOp != "+" && prevOp != "!=" && prevOp != "==" && prevOp != "<=" && prevOp != ">=" && prevOp != "<" && prevOp != ">")
				errorTermination(3);

		expression["type"] = "str";
		expression["value"] = string;

		var op = exp["Str-Exp"];
		if(op != "epsilon"){
			if(op["operation"] != undefined)
				expression["op"] = op["operation"];
			else
				expression["op"] = op["boolean"];
			expression["operand"] = makeExpression(op["Expression"], expression["op"]);
		}
		
	}else if(identifier != undefined){

		expression["type"] = "var";
		expression["value"] = identifier;

		var op = exp["ID-Exp"];
		if(op != "epsilon"){

			if(op["Fn-call'"]!=undefined){

				expression["type"] = "fn";
				if(op["Fn-call'"]["Fn-Param"]!="epsilon")
					expression["params"] = makeExParams(op["Fn-call'"]["Fn-Param"]);
				
			}

			if(op["Array"]!=undefined)
				expression["index"] = getExInd(op["Array"]);


			op = op["Op"];
			if(op != "epsilon"){
				if(op["operation"] != undefined)
					expression["op"] = op["operation"];
				else
					expression["op"] = op["boolean"];
				expression["operand"] = makeExpression(op["Expression"], expression["op"]);
			}
				
		}


	}else if(exp["num-call"]!=undefined){

		expression["type"] = "numify";
		expression["value"] = null;
		if(exp["num-call"]["Fn-call'"]["Fn-Param"]!="epsilon")
			expression["params"] = makeExParams(exp["num-call"]["Fn-call'"]["Fn-Param"]);

		expression["op"] = exp["Op"]["operation"]
		expression["operand"] = makeExpression(exp["Op"]["Expression"], expression["op"]);

	}else if(exp["load-call"]!=undefined){

		expression["type"] = "load";
		expression["value"] = null;
		if(exp["load-call"]["Fn-call'"]["Fn-Param"]!="epsilon")
			expression["params"] = makeExParams(exp["load-call"]["Fn-call'"]["Fn-Param"]);

		expression["op"] = exp["Op"]["operation"]
		expression["operand"] = makeExpression(exp["Op"]["Expression"], expression["op"]);

		// console.log("LENCALL", expression)		

	}else if(exp["len-call"]!=undefined){

		expression["type"] = "length";
		expression["value"] = null;
		if(exp["len-call"]["Fn-call'"]["Fn-Param"]!="epsilon")
			expression["params"] = makeExParams(exp["len-call"]["Fn-call'"]["Fn-Param"]);

		expression["op"] = exp["Op"]["operation"]
		expression["operand"] = makeExpression(exp["Op"]["Expression"], expression["op"]);

		// console.log("LENCALL", expression)		

	}else if(exp["rand-call"]!=undefined){

		expression["type"] = "random";
		expression["value"] = null;
		if(exp["rand-call"]["Fn-call'"]["Fn-Param"]!="epsilon")
			expression["params"] = makeExParams(exp["rand-call"]["Fn-call'"]["Fn-Param"]);

		expression["op"] = exp["Op"]["operation"]
		expression["operand"] = makeExpression(exp["Op"]["Expression"], expression["op"]);

		// console.log("LENCALL", expression)		

	}else if(exp["sqroot"]!=undefined){

		expression["type"] = "sqroot";
		expression["value"] = null;
		if(exp["sqroot"]["Fn-call'"]["Fn-Param"]!="epsilon")
			expression["params"] = makeExParams(exp["sqroot"]["Fn-call'"]["Fn-Param"]);

		expression["op"] = exp["Op"]["operation"]
		expression["operand"] = makeExpression(exp["Op"]["Expression"], expression["op"]);

		// console.log("LENCALL", expression)		

	}else{

		console.log("EXPERR",exp)
		errorTermination(99);

	}

	// console.log("Exp",expression,"\n");

	return expression;

}

function getExInd(array){

	var exInd = [];

	if(array == "epsilon")
		return undefined;

	var exp = array["Expression"];
	exInd.push(makeExpression(exp));

	while(array["Array"] != "epsilon"){
		array = array["Array"];
		exp = array["Expression"];
		exInd.push(makeExpression(exp));
	}

	return exInd;

}

function makeExParams(params){

	// console.log(params)

	var exParam = [];

	var exp = params["Expression"];
	exParam.push(makeExpression(exp));

	while(params["Fn-Param'"] != "epsilon"){
		params = params["Fn-Param'"]["Fn-Param''"];
		
		exp = params["Expression"];
		exParam.push(makeExpression(exp));
	}

	return exParam;

}

//Expresses recursively a given expression
function express(expression, verbose, everb){

	var exp = JSON.parse(JSON.stringify(expression));
	var content = [];
	var indices;
	var flag;

//	if(verbose)
		// console.log("EXP",exp)
		// console.log("VARSTACK",varstack)
	if(everb)
		console.log("ITSHERE")

	while(true){

		if(exp.type == "load"){

			exp.type = "str";
			exp.value = "";

			// console.log("EXPLENGTH", exp.params)
			for (var i = 0; i < exp.params.length; i++) {

				var filename = (express(exp.params[i]).value);
				var filecon = fs.readFileSync(filename, 'utf8');
				var clean = [];
			  	filecon = filecon.split("");
			  	filecon.forEach(function(e){
			  		if(e != "\r")
			  			clean.push(e);
			  	})
			  	clean = clean.join("");

			  	exp.value += (clean + "\n");
				// console.log([exp.value])

			}
				  	
			// console.log("EXPLENGTHF", exp.value, exp.type);

		}
		else if(exp.type == "numify"){

			exp.type = "num";
			exp.value = 0;
			// console.log("EXPLENGTH", exp.params)
			try{
				exp.value = parseInt(express(exp.params[0]).value);
			}catch(e){errorTermination(4)}
			// console.log("EXPLENGTHF", exp.value, exp.type);

		}
		else if(exp.type == "length"){

			exp.type = "num";
			exp.value = 0;
			// console.log("EXPLENGTH", exp.params)
			exp.params.forEach(function(e){
				
				var len = 0;

				if(e.type == "var"){
					var get = data[curfn].get(e.value);
					if(get.type == "num"){
						if(get.array.length > 0)
							len = get.array.length;
						else
							len = 1;
					}
					else
						len = (express(e).value.length);
				}
				else if(e.type == "num")
					len = 1;
				else
					len = (express(e).value.length);
				
				exp.value += len
			
			});

			// console.log("LENGTH", exp);
			// console.log("EXPLENGTHF", exp.value, exp.type);

		}
		else if(exp.type == "random"){

			exp.type = "num";
			var limits = [];
			var lim = 10000;
			// console.log("EXPLENGTH", exp.params)
			if(exp.params != undefined)
				exp.params.forEach(function(e){
					limits.push(express(e));
				});
			
			if(limits.length > 0)
				lim = limits[0].value;
			//TODO:Error if not number

			exp.value = (Math.floor(Math.random()*lim));

			// console.log("EXPLENGTHF", exp.value, exp.type);

		}
		else if(exp.type == "sqroot"){

			exp.type = "num";
			var target = 0;
			// console.log("EXPLENGTH", exp.params)
			if(exp.params != undefined)
				target = express(exp.params[0]).value
			
			//TODO:Error if not number

			exp.value = (Math.sqrt(target));

			// console.log("EXPLENGTHF", exp.value, exp.type);

		}

		if(exp.type == "var"){

			// console.log(exp);
			flag = exp.index!=null;
			indices = expressIndex(exp.index);
			
			var tempVar = data[curfn].get(exp.value, flag?indices:null)
			exp.type = tempVar.type;
			exp.value = tempVar.value;
			// console.log("EXPRESSVAR",exp.type, exp.value)
			//TODO: Express indices if there are any

		
		}
		else if(exp.type == "fn"){

			var parms = [];

			if(exp.params != undefined)
				exp.params.forEach(function(e){
					parms.push(express(e));
				});
			var returned = express(runFn(exp.value, parms));
			
			exp.type = returned.type;
			exp.value = returned.value;
			//TODO: Express params if there are any
		
		}

		if(exp.type == "str"){
			var value = "";
			while(exp != null && exp.type == "str"){

				// console.log("STEXP", exp)

				if(exp.op != "==" && exp.op != "!=" && exp.op != "<=" && exp.op != ">=" && exp.op != "<" && exp.op != ">" ){
					value += exp.value;
					exp = exp.operand;
				}
				else {
					
					switch(exp.op){

						case "==": value = exp.value==express(exp.operand).value?1:0;
							break;
						case "!=": value = exp.value!=express(exp.operand).value?1:0;
							break;
						case "<=": value = exp.value<=express(exp.operand).value?1:0;
							break;
						case ">=": value = exp.value>=express(exp.operand).value?1:0;
							break;
						case "<": value = exp.value<express(exp.operand).value?1:0;
							break;
						case ">": value = exp.value>express(exp.operand).value?1:0;
							break;

					}

					// console.log(value, exp.value, express(exp.operand));

					exp = exp.operand;
					if(exp.op == undefined || exp.op == "+"){

						return {"type":"num", "value":value};
						

					}

				}

				if(exp != null){
					
					if(exp.type == "var"){

						flag = exp.index!=null;
						indices = expressIndex(exp.index);
						
						var tempVar = data[curfn].get(exp.value, flag?indices:null)
						exp.type = tempVar.type;
						exp.value = tempVar.value;
			//			//TODO: Express indices if there are any
				
					}
					else if(exp.type == "fn"){

						var parms = [];
						exp.params.forEach(function(e){
							parms.push(express(e));
						});
						var returned = express(runFn(exp.value, parms));

						exp.type = returned.type;
						exp.value = returned.value;
						//TODO: Express params if there are any
						
					}
				
				}
			}
			content.push({"type":"str", "value":value});
		}
		else if(exp.type == "num"){
			
			// console.log("NUMLOCK", exp.value)

			var value = 0;
			var op;
			while(exp != null && exp.type == "num"){

				// console.log("num",exp)
				
				switch(op){

					case "+": value += exp.value;
						break;
					case "-": value -= exp.value;
						break;
					case "*": value *= exp.value;
						break;
					case "/": value /= exp.value;
						break;
					case "%": value %= exp.value;
						break;
					case "==": value = value==exp.value?1:0;
						break;
					case "!=": value = value!=exp.value?1:0;
						break;
					case ">=": value = value>=exp.value?1:0;
						break;
					case "<=": value = value<=exp.value?1:0;
						break;
					case ">": value = value>exp.value?1:0;
						break;
					case "<": value = value<exp.value?1:0;
						break;

					default: value = exp.value;

				}

				op = exp.op;
				exp = exp.operand;

				if(exp != null)
					if(exp.type == "var"){

						flag = exp.index!=null;
						indices = expressIndex(exp.index);
					
						var tempVar = data[curfn].get(exp.value, flag?indices:null)
						exp.type = tempVar.type;
						exp.value = tempVar.value;
			//			//TODO: Express indices if there are any
				
				
					}
					else if(exp.type == "fn"){

						var parms = [];
						exp.params.forEach(function(e){
							parms.push(express(e));
						});
						var returned = express(runFn(exp.value, parms));

						exp.type = returned.type;
						exp.value = returned.value;
						
						
					}
				

			}
			// console.log("Val", value)
			content.push({"type":"num", "value":value});
		
		}

		if(exp == null)
			break;

	}

	// console.log("CON", content)

	var type = "num";
	var val = 0;
	content.forEach(function(e){

		if(e.type == "str"){
			type = "str";
			return;
		}

	});

	if(type == "str")
		val = "";
	
	content.forEach(function(e){
		val += e.value;
	});

	// console.log("EXPRESSDONE",type, val)

	return {"type":type, "value":val};

}

//TODO:Fix this
function ifAction(object){

	var action = "if";

	var temp = object["Code-Block"];
	var tact = [];
	if(temp != "epsilon")
		tact = getActions(temp);

	temp = object["If'"];
	var fact = [];
	if(temp != "epsilon"){

		if(temp["If'"] != undefined)
			temp = temp["If'"]

		temp = temp["Else"]

		fact = getActions(temp);

	}

	var params = [makeExpression(object["Expression"]),tact,fact];

	return {"action":action, "params":params};

}

function whileAction(object){

	// console.log(object)

	var action = "while";

	var temp = object["Code-Block"];
	var tact = [];
	if(temp != "epsilon")
		tact = getActions(temp);

	var params = [makeExpression(object["Expression"]),tact];

	return {"action":action, "params":params};

}

function checkAsg(object){

	if(object["Asg-Exp'"]["Fn-call'"] != undefined){

		return {"action":"fn", "params":{"fn":object["identifier"],"params":getParams(object["Fn-Param"])}};

	}
	else{

		var index = object["Array"];
		if(index == "epsilon")
			index = 0;
		else{
			// console.log(index);

			if(index["Expression"]["Number"] == undefined){
				index = index["Expression"]["identifier"];
			}
			else
				index = index["Expression"]["Number"]["number"];
		}

		return {"action":"asg", "params":{"var":object["identifier"], "index":index,"expression":object["Asg-Exp'"]["Expression"]}};

	}

	return null;

}

function varset(target, expression){

	data[curfn].variables[target].type = "ok";
	varstack[target].type = "ok";
	if(expression != undefined){
		var val = express(expression);
		// console.log(val)
		data[curfn].set(target, val, null, true);
	}
}

function checkstr(object){

	for(var child in object){

		if(object[child]!="epsilon"){
			if(child == "string")
				return true;

			if(typeof object[child] != "string")
				return checkstr(object[child]);
		}

	}

	return false;	

}

function fnadd(object){

	data.push(new Table(object["identifier"]));
	fnlist[object["identifier"]] = curfn;

	data[curfn].variables = getVariables(object);	
	data[curfn].actions = getActions(object);

	// console.log(object["identifier"], data[curfn].actions);

}

//Gets and lists all variables in a function
function getVariables(object){

	var allvars = {};

	//Get Variables in Params
	var params = object["Fn-DefPar"];
	while(params != "epsilon"){
		data[curfn].parameters.push(params["identifier"]);
		allvars[params["identifier"]] = new Variable(params["identifier"], null, "nan");
		params = params["Fn-DefPar'"];
	}

	function collectIdentifiers(object){

		var out = [];

		for(var child in object){

			if(child == "Var-dec'")
				out.push(object["Var-dec'"]["identifier"]);

			if(typeof object[child] != "string"){
				var ret = collectIdentifiers(object[child]);
				
				ret.forEach(function(i){
					out.push(i);
				});

			}

		}

		return out;

	}

	var variables = collectIdentifiers(object["Code-Block"]);
	variables.forEach(function(v){
		allvars[v] = new Variable(v, null, "nan");
	});

	return allvars;

}

var breakActions = ["If", "Wh-loop", "print-call"]

function getActions(object){

	var out = [];

	for(var child in object){

		if(hasElem(child, fnNotice)){
			var next = transfer(child, object[child]);
			if(next != undefined)
				out.push(next);
		
		}

		if(hasElem(child, breakActions))
			continue;

		if(typeof object[child] != "string"){
			var ret = getActions(object[child]);
			
			ret.forEach(function(i){
				out.push(i);
			});
		}

	}

	return out;

}

function hasElem(elem, arr){

	for (var i = 0; i < arr.length; i++) {
		if(elem == arr[i])
			return true;
	}
	return false;

}

function setType(expression){

	var ret = {};

	try{
		ret["value"]
	}catch(err){
		try{
			if(expression["content"].string != undefined){
				expression["content"] = expression["content"].string;
				expression["type"] = "str"
			}
		}catch(err){}
	}

	return expression;

}

function runFn(variable, params){

	var prevfn = curfn;
	varstack["next"] = {};
	var pstack = varstack;
	varstack = varstack["next"];
	curfn = fnlist[variable];
	var fn = data[curfn];
	
	for(e in fn.variables)
		varstack[e] = new Variable(e, null, "nan");
	// console.log("FNRUN",variable,varstack);

	if(params!=null){
		var p = JSON.parse(JSON.stringify(params));
		var pars = [];
		fn.parameters.forEach(function(e){
			pars.push(e);
		});

		for (var i = 0; i < pars.length; i++) {
			varstack[pars[i]].type="ok";
			data[curfn].set(pars[i], params[i], null, false, true);
		}

	}
	runActions(fn.actions, "fn");

	// console.log("\nRETCHECK",returner);

	//default return
	var ret = {"type":"num", "value":0};
	if(returner){
		
		ret = express(retExp);
		returner = false;
		retExp = null;
	
	}

	// console.log(ret);

	curfn = prevfn;
	varstack = pstack;
	return ret;

}

function runActions(actions, struct, verbose){

	for(var i = 0; i < actions.length; i++){

		if(breaker && (struct == "wh"))
			break;

		// console.log(struct, actions)

		if(verbose){
			
			console.log("ACT",actions[i])

		}

		switch(actions[i]["action"]){

			case "print": print(actions[i]["params"])
				break;
			case "fn": runFn(actions[i]["params"]["fn"])
				break;
			case "asg": assignment(actions[i]["target"], actions[i]["index"], actions[i]["expression"])
				break;
			case "if": runIf(actions[i]["params"])
				break;	//todo check if 1 or not
			case "while": runWhile(actions[i]["params"])
				break;	//todo check if 1 or not
			case "vardec": varset(actions[i]["target"], actions[i]["expression"]);
				break;
			case "scan": prompt(actions[i]["params"]);
				break;
			case "return": returnCmd(actions[i]["expression"]);
				break;
			case "save": saveCmd(actions[i]["params"]);
				break;
		}

	}

}

function saveCmd(params){

	var file = (express(params[0]).value)
	var content = ""+(express(params[1]).value)

	fs.writeFile(file, content, function(err){

		if(err){
			errorTermination(5, err);
		}

		console.log("Successfully saved "+params[1].value+" to "+file+"!");
	})

}

function returnCmd(exp){

	// console.log("RETEXP",exp);
	returner = true;
	retExp = exp;

}

function runWhile(params){

	var cond = params[0];
	// console.log(cond)
	while(express(cond).value == 1 && !breaker && !returner){
		// console.log("WHILE TRUE")
		runActions(params[1], "while");
		// console.log("WHILE ITERATE", cond);

	}

	if(breaker)
		breaker = false;

}

function runIf(params){

	if(express(params[0]).value == 1){
		runActions(params[1], "if")
	}
	else{
		runActions(params[2], "if")
	}

}



function assignment(target, index, exp){

	// console.log("ASSIGN",target, index, exp)
	index = expressIndex(index);
	var value = express(exp);

	data[curfn].set(target, value, index);
	// console.log("CHECKASGN", data[curfn].get(target, index))

}

function print(params){

	var string = "";

	// console.log("PRINT",params)

	params.forEach(function(i){

		string += express(i).value;

	});

	process.stdout.write(string);

	// if(++looptester == 5){
	// 	process.exit();
	// }

}

function getcontent(action){

	
	var a = action["content"]==undefined?action:action["content"];

	if(a["identifier"] != undefined){

		a["index"] = 0;

		if(a["ID-Exp"]["Array"] != undefined){
		
			if(a["ID-Exp"]["Array"]["Expression"]["Number"] == undefined){
				a["index"] = parseInt(data.get(a["ID-Exp"]["Array"]["Expression"]["identifier"])["value"][0]);
			}
			else
				a["index"] = parseInt(a["ID-Exp"]["Array"]["Expression"]["Number"]["number"]);
		}

		if(a["ID-Exp"]["Num-Exp"] != undefined)
			a["next"] = a["ID-Exp"]["Num-Exp"]


		a["type"] = "var";
		return a;

	}else if(a["string"] != undefined){

		a["type"] = "str";
		return a;

	}else if(a["Number"] != undefined){

		a["type"] = "num";
		return a;

	}


}

function prompt(params){
	
	process.stdout.write(express(params[1]).value);

	var val = readlineSync.question();
	var type = express({"type":"str", "value":params[2].value}).value;
	if(type == "num")
		val = parseInt(val);

	assignment(params[0].value, params[0].index, {"type":type,"value":val});

}

function expressIndex(index){

	if(index == null)
		return null;

	var indices = [];

	// console.log("ExpressIndex")

	index.forEach(function(e, i){
		indices.push(express(e).value);
	});

	return indices;

}

function errorTermination(errtype, errparam){

	switch(errtype){

		case 0: console.log("ERROR: \""+errparam[0]+"\" was never defined in "+errparam[1]+" function.");
			break;

		case 1: console.log("ERROR: Cannot access/no index " + errparam[0] + " in variable \"" + errparam[1] + "\" in "+errparam[2]+" function.");
			break;
		
		case 2: console.log("ERROR: \""+errparam[0]+"\" was never initialized in "+errparam[1]+" function.");
			break;
		
		case 3: console.log("ERROR: Operand for a string should only be '+'.");
			break;

		case 4: console.log("ERROR: Trying to parse non-number to number.");
			break;

		case 5: console.log("ERROR: No such file: "+errparam.path+".");
			break;

		default : console.log("ERROR: Fatal Error.");
			break;
	}

	process.exit();

}