import java.util.*;
/*
    GRAMMAR class

*/
class Grammar {
    static LinkedHashMap<String, Grammar> grammarlist = new LinkedHashMap<String, Grammar>(); //list of all grammars
    


    String name;
    ArrayList<GrammarConstruct []> g = new ArrayList<GrammarConstruct[]>(); //grammar parse tree database

    //grammar object definition
    public Grammar(String name){
        this.name = name;
        Grammar.grammarlist.put(this.name, this);
    }

    //a grammar contains multiple constructs can be terminal, nonterminal, or non-definites (String, Variables, Numbers)
    void addGrammar(GrammarConstruct[] constructs ){

        this.g.add(constructs);
    }

    //grammar definition (each grammar can be seen on grammar.txt)
     static void  constructGrammars() {
        //Grammar Construct Legend
        //1 - terminal
        //2 - nonterminal
        //3 - Strin
        Grammar FUNCTION_DEC = new Grammar("FUNCTION_DEC");
        FUNCTION_DEC.addGrammar(new GrammarConstruct[] {new GrammarConstruct("create", 1), new GrammarConstruct("VarID", 3),new GrammarConstruct("(", 1),new GrammarConstruct(")", 1), new GrammarConstruct("{", 1),new GrammarConstruct("EXPR", 2), new GrammarConstruct("}", 1)});

        Grammar EXPR = new Grammar("EXPR");
        EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("OUTPUT",2), new GrammarConstruct("EXPR_STMT",2)});
        EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VARASSIGN",2), new GrammarConstruct("EXPR_STMT",2)});
        EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("INPUT",2), new GrammarConstruct("EXPR_STMT",2)});
        EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VARDEC",2), new GrammarConstruct("EXPR_STMT",2)});
        EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("IF_STMT",2), new GrammarConstruct("EXPR_STMT",2)});
        EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("WHILE_LOOP",2), new GrammarConstruct("EXPR_STMT",2)});

        Grammar EXPR_STMT = new Grammar("EXPR_STMT");
        EXPR_STMT.addGrammar(new GrammarConstruct[]{new GrammarConstruct("EXPR", 2)});
        EXPR_STMT.addGrammar(new GrammarConstruct[]{new GrammarConstruct("eps",4)});

        Grammar OUTPUT = new Grammar("OUTPUT");
        OUTPUT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("meow", 1), new GrammarConstruct("String", 3), new GrammarConstruct(";", 1)});
        OUTPUT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("meow", 1), new GrammarConstruct("VarID", 3), new GrammarConstruct(";", 1)});
        OUTPUT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("meow", 1), new GrammarConstruct("NUMBER", 2), new GrammarConstruct(";", 1)});

        Grammar INPUT = new Grammar("INPUT");
        INPUT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("purr",1), new GrammarConstruct("VarID",3), new GrammarConstruct(";",1)});

        Grammar NUMBER = new Grammar("NUMBER");
        NUMBER.addGrammar(new GrammarConstruct[] { new GrammarConstruct("Integer",3)});
        NUMBER.addGrammar(new GrammarConstruct[] { new GrammarConstruct("Float",3)});

        Grammar MATH_EXPR = new Grammar("MATH_EXPR");
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("NUMBER",2), new GrammarConstruct("+",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("NUMBER",2), new GrammarConstruct("-",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("NUMBER",2), new GrammarConstruct("*",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("NUMBER",2), new GrammarConstruct("/",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("NUMBER",2), new GrammarConstruct("%",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("+",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("-",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("*",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("/",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("%",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});

        Grammar MATH_EXPR_EXTENSION = new Grammar("MATH_EXPR_EXTENSION");
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("+",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("-",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("*",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("/",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("%",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("+",1), new GrammarConstruct("VarID",3), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("-",1), new GrammarConstruct("VarID",3), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("*",1), new GrammarConstruct("VarID",3), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("/",1), new GrammarConstruct("VarID",3), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("%",1), new GrammarConstruct("VarID",3), new GrammarConstruct("MATH_EXPR_EXTENSION",2)});
        MATH_EXPR_EXTENSION.addGrammar(new GrammarConstruct[] {new GrammarConstruct("eps",4)});

        Grammar VARASSIGN = new Grammar("VARASSIGN");
        VARASSIGN.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("=", 1), new GrammarConstruct("NUMBER",2), new GrammarConstruct(";",1)});
        VARASSIGN.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("=", 1), new GrammarConstruct("VarID",3), new GrammarConstruct(";",1)});
        VARASSIGN.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("=", 1), new GrammarConstruct("String",3), new GrammarConstruct(";",1)});
        VARASSIGN.addGrammar(new GrammarConstruct[] {new GrammarConstruct("VarID",3), new GrammarConstruct("=", 1), new GrammarConstruct("MATH_EXPR",2), new GrammarConstruct(";",1)});

        Grammar VARDEC = new Grammar("VARDEC");
        VARDEC.addGrammar(new GrammarConstruct[] { new GrammarConstruct("make",1), new GrammarConstruct("VarID",3), new GrammarConstruct("VARDEC_CONT",2)});

        Grammar VARDEC_CONT = new Grammar("VARDEC_CONT");
        VARDEC_CONT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("=",1), new GrammarConstruct("NUMBER",2), new GrammarConstruct(";",1) });
        VARDEC_CONT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("=",1), new GrammarConstruct("VarID",3), new GrammarConstruct(";",1) });
        VARDEC_CONT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("=",1), new GrammarConstruct("String",3), new GrammarConstruct(";",1) });
        VARDEC_CONT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("=",1), new GrammarConstruct("MATH_EXPR",2), new GrammarConstruct(";",1) });
        VARDEC_CONT.addGrammar(new GrammarConstruct[] {new GrammarConstruct(";",1)});

        Grammar IF_STMT = new Grammar("IF_STMT");
        IF_STMT.addGrammar(new GrammarConstruct[] {new GrammarConstruct("meowif",1),new GrammarConstruct("(",1), new GrammarConstruct("COMP_EXPR",2), new GrammarConstruct(")",1), new GrammarConstruct("{",1), new GrammarConstruct("EXPR",2), new GrammarConstruct("}",1), new GrammarConstruct("ELSE_STMT",2)});

        Grammar ELSE_STMT = new Grammar("ELSE_STMT");
        ELSE_STMT.addGrammar(new GrammarConstruct[]{new GrammarConstruct("meowelse",1), new GrammarConstruct("{",1), new GrammarConstruct("EXPR",2), new GrammarConstruct("}",1)});
        ELSE_STMT.addGrammar(new GrammarConstruct[]{new GrammarConstruct("eps",4)});

        Grammar COMP_EXPR = new Grammar("COMP_EXPR");
        COMP_EXPR.addGrammar(new GrammarConstruct[]{ new GrammarConstruct("NUMBER",2), new GrammarConstruct("COMPARATORS",2), new GrammarConstruct("NUMBER",2) });
        COMP_EXPR.addGrammar(new GrammarConstruct[]{ new GrammarConstruct("NUMBER",2), new GrammarConstruct("COMPARATORS",2), new GrammarConstruct("VarID",3) });
        COMP_EXPR.addGrammar(new GrammarConstruct[]{ new GrammarConstruct("VarID",3), new GrammarConstruct("COMPARATORS",2), new GrammarConstruct("NUMBER",2) });
        COMP_EXPR.addGrammar(new GrammarConstruct[]{ new GrammarConstruct("VarID",3), new GrammarConstruct("COMPARATORS",2), new GrammarConstruct("VarID",3) });

        Grammar COMPARATORS = new Grammar("COMPARATORS");
        COMPARATORS.addGrammar(new GrammarConstruct[] { new GrammarConstruct(">",1), new GrammarConstruct("COMPARATORS2",2)});
        COMPARATORS.addGrammar(new GrammarConstruct[] { new GrammarConstruct("<",1), new GrammarConstruct("COMPARATORS2",2)});
        COMPARATORS.addGrammar(new GrammarConstruct[] { new GrammarConstruct("=",1), new GrammarConstruct("COMPARATORS2",2)});
        COMPARATORS.addGrammar(new GrammarConstruct[] { new GrammarConstruct("!",1), new GrammarConstruct("COMPARATORS2",2)});

        Grammar COMPARATORS2 = new Grammar("COMPARATORS2");
        COMPARATORS2.addGrammar(new GrammarConstruct[] { new GrammarConstruct("=",1)});
        COMPARATORS2.addGrammar(new GrammarConstruct[] { new GrammarConstruct("eps",4)});

        Grammar WHILE_LOOP = new Grammar("WHILE_LOOP");
        WHILE_LOOP.addGrammar(new GrammarConstruct[] { new GrammarConstruct("rollwhile", 1), new GrammarConstruct("(",1), new GrammarConstruct("COMP_EXPR",2), new GrammarConstruct(")",1), new GrammarConstruct("{",1), new GrammarConstruct("EXPR",2), new GrammarConstruct("}",1)});
    }

    //a recursive function that checks the grammar of the source code
    static MessageHandler CheckGrammar(Grammar start, int tokenindex,int tabcount) {
        boolean fail = false;
        int startindex = tokenindex;
        MessageHandler mh = new MessageHandler();
        MessageHandler mhtemp;
        String tc = "";

        //System.out.println(start.name+" length is:"+start.g+" "+tokenindex);
        //starting from start grammar, traverse and compare with the source code
        for(GrammarConstruct[] gram: start.g){

            fail = false;
            String grammar = "";
            mh.error_messages = new ArrayList<String>();
            

            //traverse a grammar definition
            //each gram is an array that contains something like this
            // { [meow,1], [VarID, 3], [;,1]}
            //which can be translated to
            // PRINT -> meow VARID ;

            for(int i=0; i<gram.length; i++){

                try{
                    Tokens temptoken = Tokens.tokenlist.get(tokenindex);
                    //if the current construct is a terminal
                    if(gram[i].type == 1){

                        if(gram[i].construct.trim().equals(temptoken.token.trim())){
                          

                            grammar = grammar + tc+temptoken.token.trim()+"\n";

                        }else{
                            fail = true;
                            mh.error_messages.add(tc+"SYNTAX ERROR: EXPECTED "+gram[i].construct+" GOT "+temptoken.token+"\n");
                        //    System.out.println(tc+"SYNTAX ERROR: EXPECTED "+gram[i].construct+" GOT "+temptoken.token+"\n");
                            break;
                        }
                        tokenindex++;
                        //if the current construct is a nonterminal
                    }else if(gram[i].type == 2){
                        //recursively call the nonterminal grammar definition
                        mhtemp = CheckGrammar(Grammar.grammarlist.get(gram[i].construct), tokenindex,tabcount++);
                        //check if it returns a valid grammar
                        if(mhtemp.isFailed == true){
                            fail = true;
                            for(String k:mhtemp.error_messages){
                                mh.error_messages.add(k);
                            }
                            break;
                        }else {
                            tokenindex = mhtemp.tokenindex;
                            grammar = grammar + mhtemp.grammar;
                            for(String k:mhtemp.error_messages){
                                mh.error_messages.add(k);
                            }
                            
                        }
                        //check for string, variables, etc.
                    }else if(gram[i].type == 3){

                        if(gram[i].construct.trim().equals(temptoken.value.trim())){
                            
                            grammar = grammar +tc+temptoken.token.trim();
                            //System.out.println(tc+temptoken.token.trim());
                        }else{
                            fail = true;

                            mh.error_messages.add(tc+"SYNTAX ERROR: EXPECTED "+gram[i].construct+" GOT "+temptoken.token+"\n");
                        //    System.out.println(tc+"SYNTAX ERROR: EXPECTED "+gram[i].construct+" GOT "+temptoken.token+"\n");
                            break;
                        }
                        tokenindex++;
                    }else if(gram[i].type == 4){
                        mh.isFailed = false;
                        mh.tokenindex = tokenindex;
                        mh.grammar = grammar;
                        return mh;
                    }
                }catch(Exception e){

                    mh.error_messages.add("Missing "+gram[i].construct+"\n");
                    mh.isFailed = true;
                    mh.tokenindex = tokenindex;
                    mh.grammar = grammar;
                    return mh;
                }
            }

            //reset the search if the current grammar definition fails (check other grammars possible)
            if (fail == true){
                //System.out.println("Failed.");
                tokenindex = startindex;
            }else {
                //otherwise return a valid grammar definition
             mh.isFailed = false;
             mh.tokenindex = tokenindex;
             mh.grammar = grammar;

             return mh;
            }
        }

        //failed grammar (no valid definition)
        mh.isFailed = true;
        mh.tokenindex = tokenindex;
        return mh;
    }
}
