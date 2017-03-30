import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

public class State {

		ArrayList<Transition> transitions  = new ArrayList<Transition>();
		boolean finalState = false;
		int stateid = -1;

		//Static functions
		static State startState = new State(false, -1);
		static State strstartState = new State(false, -1);
		static int numlex = 0;
		static LinkedHashMap<String, String> tokenlist = new LinkedHashMap<String, String>();

		public State(boolean finalState, int stateid) {
			this.finalState = finalState;
			this.stateid = stateid;

		}

		public void addTransition(Transition t){
			transitions.add(t);
		}

		public static void addtoken(String token){
			char[] gta = token.toCharArray();
			State temp = startState;

			for(int i=0; i<gta.length; i++){

				boolean transitionFound = false;
				Transition temptrans = null;
				//if may same transition na
					//continue
				//else gawa ng bagong transition at bagong state

				//System.out.println("Scanning transitions of the current state...");
				for(Transition s: temp.transitions){
					//System.out.println("Transition = "+s.s);
					if(gta[i] == s.s){
						transitionFound = true;
						temptrans = s;
					}
				}
				if(transitionFound == true){
					//System.out.println("Meron na. Char already in DB. Skipping...");
					temp = temptrans.nextState;
					continue;
				}else{
					State temp2 = null;
					if(i+1 == gta.length){
						//System.out.println("Creating an end state...");
						 temp2 = new State(true, numlex++);
					}else{
						//System.out.println("Creating a normal state...");
						 temp2 = new State(false, -1);
					}
					//System.out.println("Adding new transition to the current state");
					temp.addTransition(new Transition(gta[i],temp2));
					//System.out.println("Switching to the created state..");
					temp = temp2;
				}
			}
			//System.out.println("Added "+token+" to the database.");
		}





		public static void tokenList(){
			addtoken("meow "); //numlex = 1
			addtoken("int ");  //numlex = 2 and so on...
			addtoken("float ");
			addtoken("char ");
			addtoken("bool ");
			addtoken("purr ");
			addtoken("var ");
			addtoken("string ");
			addtoken("in ");
			addtoken("txt ");
			addtoken("make ");
			addtoken("+");
			addtoken("-");
			addtoken("*");
			addtoken("/");
			addtoken("%");
			addtoken("meowif ");
			addtoken("meowelse ");
			addtoken("<");
			addtoken(">");
			addtoken("!");
			addtoken("rollwhile ");
			addtoken("stoprollwhile ");
			addtoken("rollfor ");
			addtoken("stoprollfor ");
			addtoken("rolldo ");
			addtoken("rolling ");
			addtoken("stoprolldo ");
			addtoken(",");
			addtoken("(");
			addtoken(")");
			addtoken("{");
			addtoken("}");
			addtoken("[");
			addtoken("]");
			addtoken("=");
			addtoken("create ");
			addtoken(";");
		}
//analyze source code per letter
		public static void analyzeSourceCode(String filename){
			FileReader  in = null;
			BufferedReader br = null;

			String buf = "";
			System.out.println("=============================START ANALYSIS================================");

			//File read here inside this block
			try{
				System.out.println(filename);
				in = new FileReader(filename);
				br = new BufferedReader(in);

				String line = "";
				while((line = br.readLine()) != null){
					System.out.println(line);
					buf = buf + line+"\n";

				}
				System.out.println(buf);
			} catch (FileNotFoundException e) {
				// TODO Auto-generated catch block

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}



			char[] bufca = buf.toCharArray();
			State traverse = startState;

			int startindex = 0;
			int endindex = 0;

			boolean stringchecker = false;

			for(int i=0; i<bufca.length; i++){

				System.out.println("TOKEN TO SEARCH:"+bufca[i]);
				boolean transitionFound = false;
				Transition temptrans = null;

				//check all possible transitions
				for(Transition s: traverse.transitions){
						//System.out.println("Transition = "+s.s);
					if(bufca[i] == s.s){
						System.out.println("Found! "+s.s);
						transitionFound = true;
						temptrans = s;
					}
				}
				//go to next state if found
				if(transitionFound == true){

					traverse = temptrans.nextState;

					endindex = i+1;
					//if the next state is a final state
					if(traverse.finalState == true){
					//	System.out.println(traverse.stateid+"Found token!");

						int stateid = traverse.stateid;
						traverse = startState;

						char[] token = Arrays.copyOfRange(bufca, startindex, endindex);
						System.out.println(String.copyValueOf(token).trim()+stateid);
						//save the token depending on its type
						if(stringchecker == true){
							System.out.println("Save as non-standard token");
							if(stateid == 1){
									tokenlist.put(String.copyValueOf(token).trim(), "String literal");
									Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), "String"));
							}else if(stateid == 2){
									tokenlist.put(String.copyValueOf(token).trim(), "VarID");
									Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), "VarID"));
							}else if(stateid == 3){
									endindex--;
									i--;
									token = Arrays.copyOfRange(bufca,startindex, endindex);
									tokenlist.put(String.copyValueOf(token).trim(), "Integer");
									Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), "Integer"));
							}else if(stateid == 4){
									endindex--;
									i--;
									token = Arrays.copyOfRange(bufca,startindex, endindex);
									tokenlist.put(String.copyValueOf(token).trim(), "Float");
									Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), "Float"));
							}else if(stateid == 5){
									tokenlist.put(String.copyValueOf(token).trim(), "Integer");
									Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), "Integer"));
							}else if(stateid == 6){
								tokenlist.put(String.copyValueOf(token).trim(), "Float");
								Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), "Float"));
							}else if(stateid == 7){
								endindex--;
								i--;
								token = Arrays.copyOfRange(bufca,startindex, endindex);
								tokenlist.put(String.copyValueOf(token).trim(), "Variable Identifier");
								Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), "VarID"));
							}

							stringchecker = false;
						}else{
							System.out.println("Save as standard token");
							tokenlist.put(String.copyValueOf(token).trim(),"");
							Tokens.tokenlist.add(new Tokens(String.copyValueOf(token).trim(), ""));
						}
						startindex = endindex;
						continue;

					}
				}else{
					//otherwise if the search fails
					System.out.println("Not a predefined terminal");
					//Check if string, number before concluding it is an invalid token
					if(Character.isWhitespace(bufca[startindex])){
						System.out.println("Blank space");
						startindex++;
					}
					else if(stringchecker == false){


						System.out.println("Check if string");

						traverse = strstartState;
						stringchecker = true;
						i = startindex-1;

					}else{
						System.out.println("Invalid token.");
						stringchecker = false;
						traverse = startState;
					}

					//System.out.println("token not in database.");
					//traverse = startState;
				}

			}

		}
//setup Strings, numerals, variable definition DFA traversal
		public static void setupStringNumeraltoken(){
			State temp = strstartState;
			State q1,q2,q3,q4,q5,q6,q7, q8, q9,q10,q11,q12,q13;
			q1 = new State(false, -1);
			q2 = new State(false, -1);
			q3 = new State(true, 1); //string
			q4 = new State(false, -1);
			q5 = new State(false, -1);
			q6 = new State(false, -1);
			q7 = new State(false, -1);
			q8 = new State(true, 3); //int(end)
			q9 = new State(true, 4); //float(end)
			q10 = new State(true, 2); //variable
			q11 = new State(true, 5); //int(space)
			q12 = new State(true, 6); //float(space)
			q13 = new State(true, 7); //variable(end)


			  char [] numeric = {'1','2','3','4','5','6','7','8','9','0'};
			  char [] alpha = {'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'};
			  char [] characters = {'!','@','$','%','^','&','*','(',')','-','_','=','+','{','}','|',':',';','<','>','.',',','?','/','\'','\\'};


			  temp.transitions.add(new Transition('"',q1));

			  for(char s :numeric){
				  q1.transitions.add(new Transition(s,q2));
			  }

			  for(char s :alpha){
				  q1.transitions.add(new Transition(s,q2));
			  }

			  for(char s :characters){
				  q1.transitions.add(new Transition(s,q2));
			  }

			  q1.transitions.add(new Transition(' ',q2));

			  for(char s :numeric){
				  q2.transitions.add(new Transition(s,q2));
			  }

			  for(char s :alpha){
				  q2.transitions.add(new Transition(s,q2));
			  }

			  for(char s :characters){
				  q2.transitions.add(new Transition(s,q2));
			  }
			  q2.transitions.add(new Transition(' ',q2));
			  	q2.transitions.add(new Transition('"',q3));


			  for(char s :numeric){
					  temp.transitions.add(new Transition(s,q5));
					  q5.transitions.add(new Transition(s,q5));
			    }
			  		q5.transitions.add(new Transition(';', q8));
					q5.transitions.add(new Transition(' ', q11));
			  		q5.transitions.add(new Transition('.',q6));

			  for(char s :numeric){
				q6.transitions.add(new Transition(s,q7));
				q7.transitions.add(new Transition(s,q7));
			  }
			  	q7.transitions.add(new Transition(';', q9));
				q5.transitions.add(new Transition(' ', q12));

			  for(char s :alpha){
					temp.transitions.add(new Transition(s,q4));
					q4.transitions.add(new Transition(s,q4));
			  }

			  for(char s :numeric){

				  q4.transitions.add(new Transition(s,q4));
			}
			  q4.transitions.add(new Transition(' ', q10));
			  q4.transitions.add(new Transition(';', q13));
		}

		public static void printTokenlist(){
			System.out.println("=====================Token list========================");


			for(Tokens s:Tokens.tokenlist){
					System.out.println("--------------------------\nToken: "+s.token+"\nValue: "+s.value+"\n--------------------------");
			}
		}

//main function
		public static void main (String[] args){


						 	tokenList();
							setupStringNumeraltoken();
							Grammar.constructGrammars();
							analyzeSourceCode(args[0]);
							printTokenlist();
							MessageHandler mh = Grammar.CheckGrammar(Grammar.grammarlist.get("FUNCTION_DEC"),0,0);
							System.out.println(mh.grammar);
							
							if(mh.error_messages.size() > 0){
								System.out.println("Error Messages:");
								System.out.println(mh.error_messages);
							}


		}
}
