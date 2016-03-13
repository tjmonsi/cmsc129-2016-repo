use std::fs::File;
use std::io::Read;
use std::env;

#[derive(Debug,Clone)]
enum Lexeme{
    Let, Function, If, Else, ElseIf, Do, While, For, In, Loop, StringType, BooleanType, DecimalType, Read, Write, Print, Return, Continue, Break, True, False, Arrow, GreaterEqual, LesserEqual, IsEqual, Greater, Lesser, Plus, Minus, Divide, Multiply, Equal, OpenCurly, CloseCurly, OpenParenthesis, CloseParenthesis, OpenSquare, CloseSquare, Colon, Semicolon, Range,  NewLine, DecimalValue(String), StringValue(String),  Variable(String)
}

#[allow(dead_code)]
struct RiverLexer<'a>{
    index: usize,
    src: String,

    whitespace: String,
    terminals: Vec<&'a str>,
    terminal_values: Vec<Lexeme>
}

#[allow(dead_code)]
impl<'a> RiverLexer<'a>{
    fn new(src: String) -> RiverLexer<'a>{
        RiverLexer{
            index:0, src: src,

            whitespace: String::from(" \t"),
            terminals: vec!["let", "fn", "if", "else", "elseif", "do", "while", "for", "in", "loop", "String", "Boolean", "Decimal", "read", "write", "print", "return", "continue", "break", "true", "false", "->",  ">=", "<=", "==", ">", "<", "+", "-", "/", "*", "=", "{", "}", "(", ")", "[", "]", ":", ";", "..", "\n"],
            terminal_values: vec![Lexeme::Let, Lexeme::Function, Lexeme::If, Lexeme::Else, Lexeme::ElseIf, Lexeme::Do, Lexeme::While, Lexeme::For, Lexeme::In, Lexeme::Loop, Lexeme::StringType, Lexeme::BooleanType, Lexeme::DecimalType, Lexeme::Read, Lexeme::Write, Lexeme::Print, Lexeme::Return, Lexeme::Continue, Lexeme::Break, Lexeme::True, Lexeme::False, Lexeme::Arrow, Lexeme::GreaterEqual, Lexeme::LesserEqual, Lexeme::IsEqual, Lexeme::Greater, Lexeme::Lesser, Lexeme::Plus, Lexeme::Minus, Lexeme::Divide, Lexeme::Multiply, Lexeme::Equal, Lexeme::OpenCurly, Lexeme::CloseCurly, Lexeme::OpenParenthesis, Lexeme::CloseParenthesis, Lexeme::OpenSquare, Lexeme::CloseSquare, Lexeme::Colon, Lexeme::Semicolon, Lexeme::Range, Lexeme::NewLine]
        }
    }

    fn get_char(&self) -> char{
        self.src.chars().nth(self.index).unwrap()
    }

    fn look_ahead(&self, length: usize) -> &str{
        &self.src[self.index..self.index+length]
    }

    fn whitespace(&mut self){
        while self.whitespace.contains(self.get_char()) {
            self.index+=1;
        }
    }

    fn var_sub(&mut self, var_name: &mut String){
        while self.get_char().is_alphanumeric() {
            var_name.push(self.get_char());
            self.index+=1;
        }
    }

    fn var(&mut self) -> Lexeme{
        let mut var_name = String::new();

        if self.get_char().is_alphabetic() {
            var_name.push(self.get_char());
            self.index+=1;
            self.var_sub(&mut var_name);
        }
        Lexeme::Variable(var_name)
    }

    fn num_sub(&mut self, number: &mut String){
        while self.get_char().is_numeric() {
            number.push(self.get_char());
            self.index+=1;
        }
    }

    fn num(&mut self) -> Lexeme{
        let mut number = String::new();

        self.num_sub(&mut number);

        Lexeme::DecimalValue(number)
    }

    fn string(&mut self) -> Lexeme{
        let mut string = String::new();
        let mut prev_char = ' ';
        self.index+=1;
        while self.get_char() != '\"' || prev_char=='\\' {
            string.push(self.get_char());
            prev_char = self.get_char();
            self.index+=1;
        }
        self.index+=1;
        Lexeme::StringValue(string)
    }

    fn analyze(&mut self) -> Vec<Lexeme>{
        let mut lexemes = Vec::<Lexeme>::new();

        while self.index<self.src.len()-1 {
            let mut basic_lexeme = false;

            self.whitespace();
            for i in 0..self.terminals.len(){
                if self.terminals[i].len()+self.index < self.src.len() && self.look_ahead(self.terminals[i].len()) == self.terminals[i] {
                    lexemes.push(self.terminal_values[i].clone());
                    self.index+=self.terminals[i].len();
                    basic_lexeme= true;
                    break;
                }
            }
            if !basic_lexeme {
                if self.get_char().is_numeric() {
                    lexemes.push(self.num());
                } else if self.get_char() == '\"' {
                    lexemes.push(self.string());
                } else if self.get_char().is_alphabetic() {
                    lexemes.push(self.var());
                }else {
                    println!("Syntax error.");
                    println!("{}/{}",self.index, self.src.len());
                }
            }
        }
        lexemes
    }
}

fn main(){
    let args: Vec<String> = env::args().collect();
    if args.len()!=2 {
        println!("Usage: {} <source code.rvr>\n", args[0]);
        return;
    }
    let mut srcfile = File::open(&args[1]).unwrap();
    let mut contents: Vec<u8> = Vec::new();

    // Read file into byte vector
    srcfile.read_to_end(&mut contents).unwrap();

    // Turn byte vector into string
    let src = String::from_utf8(contents).unwrap();

    println!("Source code:\n{}", src);

    let mut rl = RiverLexer::new(src);
    let lxs = rl.analyze();

    println!("Lexemes:");
    for i in lxs {
        println!("{:?}", i);
    }
}
