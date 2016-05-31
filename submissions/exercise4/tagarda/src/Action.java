import java.util.*;
import java.io.*;
class Action{
    /*
    This class executes the code validated by the parser.
    */
    static ArrayList<Action> actionlist = null;
    static LinkedHashMap<String, String> symboltable = new LinkedHashMap<String, String>();
    static int index = 0;

    String name;
    String lex;
    String type;
    public Action(String name, String lex, String type){
        this.name = name;
        this.lex = lex;
        this.type = type;
    }

    //starting from the first action, determine the action and traverse recursively
    static void execute() {

        try{
            while(true){
                determineAction();
                index++;
            }
        }catch(Exception e){
            //e.printStackTrace();
        }


    }

    //check what function to execute depending on the lexeme
    static void determineAction() {

        Action now = actionlist.get(index);
        //System.out.println(now.lex);
        if(now.lex.equals("meow")){
            index++;
            printFunction();
        }else if(now.lex.equals("make")){
            index++;
            varDec();
        }else if(now.name.equals("VARASSIGN")){
            varDec();
        }else if(now.lex.trim().equals("purr")){
            index++;

            input();
        }else if(now.lex.trim().equals("meowif")){
            index++;
            ifelse();
        }else if(now.lex.trim().equals("rollwhile")){
            index++;
            whileloop();
        }

    }

    //execute a while loop + validate
    static void whileloop() {
        int saveindex = index;
        boolean bool = true;
        while(bool){
            //System.out.println("ULIT");
            index = saveindex;
            Action now = actionlist.get(index);
            index++; // (
            now = actionlist.get(index);
            double x,y;
            int action = -1;


            if(now.type.equals("Integer") || now.type.equals("Float")){
                x = Double.parseDouble(now.lex);
            }else{
                x = Double.parseDouble(symboltable.get(now.lex));
            }

            index++;
            now = actionlist.get(index);

            if(now.lex.equals(">")){
                action = 1;

            }else if(now.lex.equals("<")){
                action = 2;

            }else if(now.lex.equals("=")){
                action = 3;

            }else if(now.lex.equals("!")){
                action = 4;

            }

            index++;
            now = actionlist.get(index);

            if(now.name.equals("COMPARATORS2")){
                if( action == 1){
                    action = 5;
                }else if(action == 2){
                    action = 6;
                }else if(action == 3){
                    action = 7;
                }else if(action == 4){
                    action = 8;
                }

                index++;
                now = actionlist.get(index);
            }

            if(now.type.equals("Integer") || now.type.equals("Float")){
                y = Double.parseDouble(now.lex);
            }else{
                y = Double.parseDouble(symboltable.get(now.lex));
            }
            //System.out.println(action+" "+x+" "+y);
            switch(action){
                case 1:
                    bool = x > y;
                break;
                case 2:
                    bool = x < y;
                break;
                case 5:
                    bool = x >= y;
                break;
                case 6:
                    bool = x <= y;
                break;
                case 7:
                    bool = new Double(x).intValue() == new Double(y).intValue() ;
                break;
                case 8:
                    bool = new Double(x).intValue() != new Double(y).intValue();
                break;
            }
            //System.out.println(bool);


            index++; // )
            index++; // {
            index++; // firt function in if
            now = actionlist.get(index);

            while(!now.lex.equals("}")){
                if(bool == true){
                    determineAction();
                }

                index++;
                now = actionlist.get(index);
            }

            if(bool == false){
                break;
            }
        }
    }

    //execute an if-else function
    static void ifelse() {
        Action now = actionlist.get(index);
        index++; // (
        now = actionlist.get(index);
        double x,y;
        int action = -1;
        boolean bool = false;

        if(now.type.equals("Integer") || now.type.equals("Float")){
            x = Double.parseDouble(now.lex);
        }else{
            x = Double.parseDouble(symboltable.get(now.lex));
        }

        index++;
        now = actionlist.get(index);

        if(now.lex.equals(">")){
            action = 1;

        }else if(now.lex.equals("<")){
            action = 2;

        }else if(now.lex.equals("=")){
            action = 3;

        }else if(now.lex.equals("!")){
            action = 4;

        }

        index++;
        now = actionlist.get(index);

        if(now.name.equals("COMPARATORS2")){
            if( action == 1){
                action = 5;
            }else if(action == 2){
                action = 6;
            }else if(action == 3){
                action = 7;
            }else if(action == 4){
                action = 8;
            }

            index++;
            now = actionlist.get(index);
        }

        if(now.type.equals("Integer") || now.type.equals("Float")){
            y = Double.parseDouble(now.lex);
        }else{
            y = Double.parseDouble(symboltable.get(now.lex));
        }
        //System.out.println(action+" "+x+" "+y);
        switch(action){
            case 1:
                bool = x > y;
            break;
            case 2:
                bool = x < y;
            break;
            case 5:
                bool = x >= y;
            break;
            case 6:
                bool = x <= y;
            break;
            case 7:
                bool = new Double(x).intValue() == new Double(y).intValue();
            break;
            case 8:
                bool = new Double(x).intValue() == new Double(y).intValue();
            break;
        }
        //System.out.println(bool);


        index++; // )
        index++; // {
        index++; // firt function in if
        now = actionlist.get(index);

        while(!now.lex.equals("}")){
            if(bool){
                determineAction();

            }
            index++;
            now = actionlist.get(index);
        }

        //else
        index++;
        now = actionlist.get(index);

        if(now.lex.equals("meowelse")){ //meowelse
            index++;// {
            index++;//first function in else
            now = actionlist.get(index);

                while(!now.lex.equals("}")){
                    if(bool == false){
                        determineAction();
                    }
                    index++;
                    now = actionlist.get(index);
                }
            index++; // }
        }

    }

    //execute a print function
    static void printFunction() {
        Action now = actionlist.get(index);
        while(!now.lex.equals(";")){
            if(now.type.equals("String") || now.type.equals("Integer") || now.type.equals("Float")){
                System.out.println(now.lex);
            }else{
                System.out.println(symboltable.get(now.lex));
            }
            index++;
            now = actionlist.get(index);
        }
    }
    //execute variable definition / assignment function
    static void varDec(){
        Action now = actionlist.get(index);
        String var = now.lex;
        if(!symboltable.containsKey(now.lex))
        symboltable.put(now.lex,"");
        index++ ;
        now = actionlist.get(index);
        double x = 0;
        int action = -1;

        while(!now.lex.equals(";")){
            if(now.name.equals("NUMBER") || now.type.equals("String")){
                if(action == -1){
                 x = Double.parseDouble(now.lex);
                }else {
                        switch(action){
                            case 1:
                                x = x + Double.parseDouble(now.lex);
                            break;
                            case 2:
                                x = x - Double.parseDouble(now.lex);
                            break;
                            case 3:
                                x = x * Double.parseDouble(now.lex);
                            break;
                            case 4:
                                x = x / Double.parseDouble(now.lex);
                            break;
                            case 5:
                                x = x % Double.parseDouble(now.lex);
                            break;
                        }
                    }
            }else if(now.type.equals("VarID")){
                if(action == -1){
                    try{
                    x = Double.parseDouble(symboltable.get(now.lex.trim()));
                    }catch(Exception e){
                            x = 0;
                            e.printStackTrace();
                    }
                }else {
                        switch(action){
                            case 1:
                                x = x + Double.parseDouble(now.lex);
                            break;
                            case 2:
                                x = x - Double.parseDouble(now.lex);
                            break;
                            case 3:
                                x = x * Double.parseDouble(now.lex);
                            break;
                            case 4:
                                x = x / Double.parseDouble(now.lex);
                            break;
                            case 5:
                                x = x % Double.parseDouble(now.lex);
                            break;
                        }
                    }
            }else if(now.lex.equals("+")){
                action = 1;

            }else if(now.lex.equals("-")){
                action = 2;

            }else if(now.lex.equals("*")){
                action = 3;

            }else if(now.lex.equals("/")){
                action = 4;

            }else if(now.lex.equals("%")){
                action = 5;

            }


            index++;
            now = actionlist.get(index);
        }

        symboltable.put(var.trim(),String.valueOf(x));
    }

    //execute input function
    static void input() {

        Action now = actionlist.get(index);
        while(!now.lex.equals(";")){
            try{
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            String accStr;
            accStr = br.readLine();

            symboltable.put(now.lex, accStr.trim());
        }catch(Exception e){

        }
            index++;
            now = actionlist.get(index);
        }
    }


}
