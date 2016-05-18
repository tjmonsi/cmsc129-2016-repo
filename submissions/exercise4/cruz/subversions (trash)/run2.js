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

Table.prototype.set = function(index, content, type){

	this.variables[index] = new Variable(content, type);

}

Table.prototype.get = function(index) {
	
	if(this.variables[index] == undefined)
		errorTermination(0, index);
	return this.variables[index];

};

var data = new Table();


var ignore = ["Fn-Param", "Expression"];


function main(){

	console.log("Interpreted:\n=======================\n");

	preloadfn(synseq);
	fncall("main");

}

function preloadfn(object){
	for(var child in object){

		if(child == "Fn-def"){
			transfer(child, object[child]);
			break;
		}
		preloadfn(object[child]);
		
	}
	
}


function transfer(header, object){
	
	switch(header){

		case "Fn-def": fnadd(object);
			break;
		case "Var-dec'": varadd(object);
			break;
		case "print-call": return {"action":"print", "params":getParams(object["Fn-call'"]["Fn-Param"])};
			break;
		case "Expression": return object;
			break;

	}


}

function varadd(object){

	var id = object["identifier"];
	var value = computeE(object["Var-dec''"]["Expression"]);
	var type = checkstr(object)?"str":"num";

	data.set(id, value, type);

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

function checkstrCol(collection){

	for (var i = 0; i < collection.length; i++) {
		if(collection[i].type == 'str')
			return true;
	}
	return false;

}

function fnadd(object){

	data.set(object["identifier"], fnproc(object, []), "fn");

}

function fnproc(object, out){

	for(var child in object){

		var next = transfer(child, object[child]);
		
		if(next != undefined && !hasElem(child, ignore))
			out.push(next);

		if(typeof object[child] != "string")
			fnproc(object[child], out);

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

function computeE(expression){

	var ex = express(expression, null);
	
	console.log("exp",ex)

	var val;
	var type = "num";

	//TODO

	console.log(type)


	return ex;

}

function buildExpression(expression){



}

function express(expression, cur){

	
	
}

function concatStr(expression){

	

}

function fncall(variable){

	var fn = data.get(variable);

	for(var i = 0; i < fn.value.length; i++){

		switch(fn.value[i]["action"]){

			case "print": print(fn.value[i]["params"])
				break;

		}

	}

}

function print(content){

	var string = "";
	console.log(content);
	content.forEach(function(i){
		string += i.val;
	});

	process.stdout.write(string);

}

function stringify(value, type){

	if(type == null)
		type = "str";

	var string = "";
	
	if(type == "str")
		string += value;
	else if(type == "var")
		string += data.get(value).value;
	else if(child == "num")
		string += value;

	return string;

}

function getParams(params){

	var out = [];

	for(var child in params){

		if(child == "Expression")
			out.push(computeE(transfer(child, params[child])));

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

function prompt(question){

	return readlineSync.question(question);

}

function errorTermination(errtype, errparam){

	switch(errtype){

		case 0: console.log("ERROR: \""+errparam+"\" was never defined.");
			break;

	}

	process.exit();

}