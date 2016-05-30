compile:
	gcc -o bin/LexicalAnalyzer/lexical_analyzer.exe src/LexicalAnalyzer/lexical_analyzer.c
	gcc -o bin/SyntaxAnalyzer/syntax_analyzer.exe src/SyntaxAnalyzer/syntax_analyzer.c
	gcc -o bin/Interpreter/interpreter.exe src/Interpreter/interpreter.c -lm
	
%:
	clear
	@echo "---------------------------------- LEXICAL ANALYZER ----------------------------------"
	gcc -o bin/LexicalAnalyzer/lexical_analyzer.exe src/LexicalAnalyzer/lexical_analyzer.c
	./bin/LexicalAnalyzer/lexical_analyzer.exe $(MAKECMDGOALS)
	@echo "----------------------------------- SYNTAX ANALYZER ----------------------------------"
	gcc -o bin/SyntaxAnalyzer/syntax_analyzer.exe src/SyntaxAnalyzer/syntax_analyzer.c
	./bin/SyntaxAnalyzer/syntax_analyzer.exe
	@echo "------------------------------------- INTERPRETER ------------------------------------"
	gcc -o bin/Interpreter/interpreter.exe src/Interpreter/interpreter.c -lm
	./bin/Interpreter/interpreter.exe
	@echo "--------------------------------------------------------------------------------------"