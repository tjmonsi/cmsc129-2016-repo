import java.util.ArrayList;
class Tokens {
    	static ArrayList<Tokens> tokenlist  = new ArrayList<Tokens>();

        String token;
        String value;
        public Tokens(String token, String value){
            this.token = token;
            this.value = value;
        }
}
