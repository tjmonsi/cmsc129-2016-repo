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
			addtoken("meow"); //numlex = 1
			addtoken("int");  //numlex = 2 and so on...
			addtoken("float");
			addtoken("char");
			addtoken("bool");
			addtoken("purr");
			addtoken("var");
			addtoken("string");
			addtoken("in");
			addtoken("txt");
			addtoken("make");
			addtoken("+");
			addtoken("-");
			addtoken("*");
			addtoken("%");
			addtoken("meowif");
			addtoken("meowelse");
			addtoken("<");
			addtoken(">");
			addtoken(">=");
			addtoken("<=");
			addtoken("rollwhile");
			addtoken("stoprollwhile");
			addtoken("rollfor");
			addtoken("stoprollfor");
			addtoken("rolldo");
			addtoken("rolling");
			addtoken("stoprolldo");
			addtoken(",");
			addtoken("(");
			addtoken(")");
			addtoken("{");
			addtoken("}");
			addtoken("[");
			addtoken("]");
			addtoken("=");
			addtoken("==");
			addtoken("create");
			
		}
		
		public static void analyzeSourceCode(){
			FileReader  in = null;
			BufferedReader br = null;
			
			String buf = "";
			System.out.println("=============================START ANALYSIS================================");
			
			//File read here inside this block
			try{
				in = new FileReader("src/sourcecode.cat");
				br = new BufferedReader(in);
				
				String line = "";
				while((line = br.readLine()) != null){
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
			
				
				for(Transition s: traverse.transitions){
						//System.out.println("Transition = "+s.s);
					if(bufca[i] == s.s){
						System.out.println("Found! "+s.s);
						transitionFound = true;
						temptrans = s;
					}
				}
				
				if(transitionFound == true){
					
					traverse = temptrans.nextState;
					
					endindex = i+1;
					
					if(traverse.finalState == true){
					//	System.out.println(traverse.stateid+"Found token!");
						
						int stateid = traverse.stateid;
						traverse = startState;
						
						char[] token = Arrays.copyOfRange(bufca, startindex, endindex);
						System.out.println(String.copyValueOf(token).trim()+stateid);
						
						if(stringchecker == true){
							//System.out.println("Save as non-standard token");
							tokenlist.put(String.copyValueOf(token).trim(), "String literal"+stateid);
							stringchecker = false;
						}else{
							//System.out.println("Save as standard token");
							tokenlist.put(String.copyValueOf(token).trim(),"");
						}
						startindex = endindex;
						continue;
					
					}
				}else{
					//System.out.println("Not a predefined terminal");
					//Check if string, number before concluding it is an invalid token 
					if(Character.isWhitespace(bufca[startindex])){
					//	System.out.println("Blank space");
						startindex++;
					}
					else if(stringchecker == false){
						
					
						//System.out.println("Check if string");
						
						traverse = strstartState;
						stringchecker = true;				
						i = startindex-1;
						
					}else{	
						//System.out.println("Invalid token.");
						stringchecker = false;
						traverse = startState;
					}
					
					//System.out.println("token not in database.");
					//traverse = startState;
				}
				
			}
			
		}
		
		public static void setupStringNumeraltoken(){
			State temp = strstartState;
			State q1,q2,q3,q4,q5,q6,q7, q8, q9,q10;
			q1 = new State(false, -1);
			q2 = new State(false, -1);
			q3 = new State(true, 1);
			q4 = new State(false, -1);
			q5 = new State(false, -1);
			q6 = new State(false, -1);
			q7 = new State(false, -1);
			q8 = new State(true, 3);
			q9 = new State(true, 4);
			q10 = new State(true, 2);
			
			
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
			  		q5.transitions.add(new Transition(' ', q8));
			  		q5.transitions.add(new Transition('.',q6));
			  		
			  for(char s :numeric){
				q6.transitions.add(new Transition(s,q7));
				q7.transitions.add(new Transition(s,q7));
			  }
			  	q7.transitions.add(new Transition(' ', q9));
			  
			  for(char s :alpha){
					temp.transitions.add(new Transition(s,q4));
					q4.transitions.add(new Transition(s,q4));
			  }
			  q4.transitions.add(new Transition(' ', q10));
		}
		
		public static void printTokenlist(){
			System.out.println("=====================Token list========================");
			
			Set<String>keys = tokenlist.keySet();
			
			Iterator<String> itr = keys.iterator();
			
			while(itr.hasNext()){
				
				String str = itr.next();
				
				System.out.println("--------------------------\nToken: "+str+"\nValue: "+tokenlist.get(str)+"\n--------------------------");
			}
		}
		
		public static void main (String[] args){
						
						 
						 tokenList();
							setupStringNumeraltoken();
							analyzeSourceCode();
							printTokenlist();
							

		}
}
