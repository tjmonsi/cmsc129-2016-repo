var readlineSync = require('readline-sync');

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

var Table = function(){

	this.variables = {};

}

var Variable = function(value, type){

	this.value = value;
	this.type = type;

}

Table.prototype.set = function(index, content, type, i){

	if(this.variables[index] == undefined)
		errorTermination(0, index);

	if(i == undefined)
		i = 0;

	this.variables[index].value[i] = content;
	this.variables[index].type = type;

}

Table.prototype.get = function(index) {

	
	if(this.variables[index] == undefined)
		errorTermination(0, index);
	
	if(this.variables[index].type == "nan")
		errorTermination(2, index);

	return this.variables[index];

};


var data = new Table();


var fnNotice = ["print-call", "Var-dec'", "Asg-Exp", "If", "Wh-loop", "scan-call"];


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

			transfer(child, object[child]);

		}

		if(typeof object[child] != "string")
			preloadfn(object[child]);
		
	}
	
}


function transfer(header, object){
	
	switch(header){

		case "Fn-def": fnadd(object);
			break;
		case "Var-dec'": return {"action":"vardec", "content":object};
			break;
		case "Asg-Exp": return checkAsg(object);
			break;
		case "print-call": return {"action":"print", "params":getParams(object["Fn-call'"]["Fn-Param"])};
			break;
		case "Expression": return {"action":"exp", "content":object};
			break;
		case "If": return ifAction(object);
			break;
		case "Wh-loop": return whileAction(object);
			break;
		case "scan-call": return {"action":"scan","params":getParams(object["Fn-call'"]["Fn-Param"])};
			break;
	}


}

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

	var params = [setType(transfer("Expression", object["Expression"])),tact,fact];

	return {"action":action, "params":params};

}

function whileAction(object){

	// console.log(object)

	var action = "while";

	var temp = object["Code-Block"];
	var tact = [];
	if(temp != "epsilon")
		tact = getActions(temp);

	var params = [setType(transfer("Expression", object["Expression"])),tact];

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

function varadd(object){

	// console.log(object)

	var id = object["identifier"];
	var value = [];
	
	if(object["Var-dec''"]["Expression"] == undefined){

		data.variables[id] = new Variable(["0"], "nan");
		return;

	}

	var temp = getcontent(object["Var-dec''"]["Expression"])
	var type = temp["type"];

	value.push(getValue(temp))

	// if(object["Var-dec''"]["Expression"]["identifier"] != undefined){

	// 	var v = object["Var-dec''"]["Expression"];
		
	// }
	// else
	// 	value.push(setType(object["Var-dec''"]["Expression"]));
	
	data.variables[id] = new Variable(value, type);

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

	var val = [getActions(object)];
	data.variables[object["identifier"]] = new Variable(val, "fn");

}

function getActions(object){

	var out = [];

	for(var child in object){

		if(hasElem(child, fnNotice)){

			var next = transfer(child, object[child]);
			if(next != undefined)
				out.push(next);
		
		}

		if(child == "If" || child == "Wh-loop")
			break;

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

function runFn(variable){

	var fn = data.get(variable);
	runActions(fn.value[0])

}

function runActions(actions){

	for(var i = 0; i < actions.length; i++){

		switch(actions[i]["action"]){

			case "print": print(actions[i]["params"])
				break;
			case "fn": runFn(actions[i]["params"]["fn"])
				break;
			case "asg": assignment(actions[i]["params"])
				break;
			case "if": runIf(actions[i]["params"])
				break;	//todo check if 1 or not
			case "while": runWhile(actions[i]["params"])
				break;	//todo check if 1 or not
			case "vardec": varadd(actions[i]["content"]);
				break;
			case "scan": prompt(actions[i]["params"]);
				break;
		}

	}

}

function runWhile(params){

	// console.log(params[0])

	while(getValueContent(params[0]) == 1){
		runActions(params[1]);
	}

}

function runIf(params){

	// console.log(params[0])

	if(getValueContent(params[0]) == 1){
		runActions(params[1])
	}
	else{
		runActions(params[2])
	}

}



function assignment(params){

	// console.log(params)

	var value = getValueContent(params.expression);

	var index;
	if((typeof params.index) == "string")
		index = data.get(params.index).value[0];
	else
		index = parseInt(params.index)

	// console.log("index", index)
	data.set(params.var, value, checkstr(value)?"str":"num", index);
	
	// console.log(data.get(params.var))

}

function print(params){

	var string = "";

	params.forEach(function(i){

		string += getValueContent(i)

	});

	process.stdout.write(string);

}

function getValueContent(exp){

	var content = getcontent(exp);
	// console.log(content)
	switch(content["type"]){

		case "var": return getValue(data.get(content["identifier"])["value"], content["index"], content["identifier"], content["next"]);
		case "str": return getValue(content);
		case "num": return getValue(content);
	
	}	

}

function getValue(something, index, id, next){

	if(something["identifier"] != undefined){
		
		if(something["index"] == undefined)
			something["index"] = 0

		var val = data.get(something["identifier"]).value[something["index"]];

		if(val["Number"] != undefined){
			val = parseInt(val["Number"]["number"]);
		}


		if(something["next"] != undefined){

			return lowMath(val, getValue(something["next"]))
		
		}
		return val;

	}else if(something["string"] != undefined){

		var str = something["string"];

		if(something["Str-Exp"] != "epsilon")
			str += getValue(something["Str-Exp"]["Expression"])

		return str;

	}else if(something["Number"] != undefined){

		var num = parseInt(something["Number"]["number"]);

		if(something["Number"]["-"] != undefined)
			num *= -1;

		return lowMath(num, something)

	}else {

		if(index != undefined){

		something = something[index]
		if(something == undefined)
			errorTermination(1, [index, id])

		}

		if(next != undefined){

			return lowMath(something, getValue(next))
		
		}

		return something;

	}


}

function lowMath(op, something){
	
	if(something["Bool"]!=undefined){

		if((typeof op) == "string")
			return 0;

		if(something["Bool"]["=="]!=undefined && op == getValueContent(something["Bool"]["Expression"])){
			return 1;
		}
		else if(something["Bool"]["!="]!=undefined && op != getValueContent(something["Bool"]["Expression"])){
			return 1;
		}
		else if(something["Bool"][">="]!=undefined && op >= getValueContent(something["Bool"]["Expression"])){
			return 1;
		}
		else if(something["Bool"]["<="]!=undefined && op <= getValueContent(something["Bool"]["Expression"])){
			return 1;
		}
		else if(something["Bool"][">"]!=undefined && op > getValueContent(something["Bool"]["Expression"])){
			return 1;
		}
		else if(something["Bool"]["<"]!=undefined && op < getValueContent(something["Bool"]["Expression"])){
			return 1;
		}

		return 0;

	}
	else if(something["Num-Exp"] != undefined || something["Math-Exp'"] != undefined|| something["Term'"] != undefined){


		var term = something["Math-Exp'"]
		var factor = something["Term'"];
		var short;


		if(term == undefined && factor == undefined){
			short = something["Num-Exp"]
			term = short["Math-Exp'"];
			factor = short["Term'"];
		}
		
		var op;
		if(term != undefined){

			if(term["+"] != undefined)
				op += getValue(term["Math-Exp"]["Term"]["Factor"])
			else
				op -= getValue(term["Math-Exp"]["Term"]["Factor"])

		}
		else if(factor != undefined){

			if(factor["*"] != undefined)
				op *= getValue(factor["Term"]["Factor"])
			else if(factor["/"] != undefined)
				op /= getValue(factor["Term"]["Factor"])
			else
				op %= getValue(factor["Term"]["Factor"])
			

		}
	
	}

	return op;

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

function getParams(params){

	var out = [];

	for(var child in params){

		if(child == "Expression")
			out.push(setType(transfer(child, params[child])));
		
		if(params[child] != "epsilon" && child == "Fn-Param'"){
			var next = params[child]["Fn-Param''"]
			var retrieved = getParams(next);

			retrieved.forEach(function(i){
				out.push(i);
			});
		
		}

	}

	return out;

}

function prompt(params){
	
	process.stdout.write(getValueContent(params[1]));

	var val = parseInt(readlineSync.question());
	data.set(getcontent(params[0])["identifier"], val, getValueContent(params[2]), parseInt(0));

	// console.log(data.get("y"));

}

function errorTermination(errtype, errparam){

	switch(errtype){

		case 0: console.log("ERROR: \""+errparam+"\" was never defined.");
			break;

		case 1: console.log("ERROR: Cannot access/no index " + errparam[0] + " in variable \"" + errparam[1] + "\"");
			break;
		
		case 0: console.log("ERROR: \""+errparam+"\" was never initialized.");
			break;
	}

	process.exit();

}