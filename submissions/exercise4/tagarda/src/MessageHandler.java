import java.util.*;
//message passing protocol for recursive grammar parsing

class MessageHandler {
    boolean isFailed;
    int tokenindex;
    ArrayList<String> error_messages = new ArrayList<String>();
    String grammar;
    ArrayList<Action> actionlist = new ArrayList<Action>();

    ArrayList<String> generic_messages = new ArrayList<String>();
    ArrayList<Float> numbers = new ArrayList<Float>();

    public MessageHandler(){

    }
}
