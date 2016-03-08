//http://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-node-js
//https://www.npmjs.com/package/filereader
//https://swtch.com/~rsc/regexp/regexp1.html

//---[:Dependencies

//--[FileAPI
	var FileAPI = require('file-api')
	  , File = FileAPI.File
	  , FileList = FileAPI.FileList
	  , FileReader = FileAPI.FileReader
	  ;
//--]
//--[Token Types
	tokt = {
		"unknown":0,
		"number":1,
		"character":2,
		"var":3,
		"newline":99,
	}
//--]

//---]

//---[:Functions

//Lexical Analysis
function analyze(text,filename){

	console.log("----------\nContent of \""+filename+"\":\n----------\n"+text+"\n----------\n");	
	var tokens = getTokens(text);
	console.log(tokens["results"]);
	var warnings = tokens["warnings"];
	for (var i = 0; i < warnings.length; i++) {
		if(warnings[i]!="")
			console.log(warnings[i]);
	}
		

}

//checks the text per character then finds tokens by state
function getTokens(text){

	var t = [];
	var line = 1;
	var out = [];
	var warnings = [];

	for(var i = 0; i < text.length; i++)
		t.push(text[i]);
	
	while(t.length > 0){
		var temp = check(t,line);
		t = temp["text"];
		line = temp["line"];
		var toks = temp["tok"];
		warnings.push(temp["warning"]);
		for(var i = 0; i < toks.length; i++)
			out.push(toks[i]);

		console.log(t+":"+ line+"\n");
	}



	return {"results":out, "warnings":warnings};

}

//This is the main function
function main(){

	var file = process.argv[2]
	if(file === undefined || process.argv > 3){
		console.log("Error: No file argument!\nRun \"node lex.js <.cjs file>\" (sample: node lex.js sample.cjs)");
		return
	}
	var reader = new FileReader();

	reader.onload = function(e) {
		input = reader.result;
		analyze(input, file);
	}

	reader.readAsText(new File(file));

}

//Checks for keywords delimited by space or newlines
function check(next, line){

	var test = [];
	var errline = line;
	var newline = false;

	do{
		var c = next.shift();
		console.log(c)
		test.push(c);
	}while((c!=' '&&c!='\r'&&c!='\n')&&next.length>0);
	if(test[test.length-1]==' ')	//delimited by space
		test.pop();
	else{	//delimited by newline
		if(test[test.length-1]=='\r'){
			test.pop();
			newline = true;
			if(next[0]=='\n')
				next.shift();
		}
		if(test[test.length-1]=='\n'){
			test.pop();
			newline = true;
		}
		if(newline)
			line++;
	}

	test = test.join("");

	var out = [];
	var warning = "";

	var result;
	var token;
	var type;
	switch(test){

		case "":
			break;

		case "function": 
			token = test;
			type = tokt["var"];
			break;

		case "var": 
			token = test;
			type = tokt["var"];
			break;

		default: //checkAlphaNum(test,next);
			token = test;
			warning = "[ERROR] Line "+errline+": Syntax Error. Unknown keyword \""+test+"\"\n";

	}

	if(test != "") //empty test token
		out.push({"token":token, "type":type});
	if(newline)	//newline occurred
		out.push({"token":"\n", "type":tokt["newline"]});

	return {"text":next, "line":line, "tok":out, "warning":warning};

}

//Checks for non-keywords
function checkNonKey(){

}

//---]

main();