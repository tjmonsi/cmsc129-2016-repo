function main() {
    
    var string;

    scan(string, "Input String: ", "str");

    var left = 0;
    var right = len(string)-1;
    var pal = 1;
    while (left < right) {
        if (string[left] != string[right]) {
            pal = 0;
        }else{}
        left = left+1;
        right = right-1;
    }

    if(pal){
        print("True\n");
    }else{print("False\n");}
    
}
