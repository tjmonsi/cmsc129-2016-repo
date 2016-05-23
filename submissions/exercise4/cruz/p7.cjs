function main() {
    
    var inst = load("guide.txt");
    var fname;
    scan(fname, "Input File Name to save: ", "str");
    save(fname, inst);
    
}
