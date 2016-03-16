use std::*;
use std::io::prelude::*;

/***
 * Enum Lexeme
 * -> lexeme tokens to be extract from the source code
 */
#[allow(dead_code)]
#[derive(Debug, Clone)]
enum Lexeme {
    Let, Out, In, Stdout, Stdin, For, While, DoWhile, If, ElseIf, Else, Continue, Break, Return,
    True, False, Fn, Greater, GreaterEqual, Less, LessEqual, IsEqual, IsNotEqual, Plus, Minus,
    Multiply, Divide, Modulo, Equals, Comma, SemiColon, OpenBrace, CloseBrace, OpenParenthesis,
    CloseParenthesis, OpenBracket, CloseBracket, Newline, VariableName(String), StringLiteral(String), Number(String)
}

/***
 * Structure Lexer
 * -> Lexical Analyzer structure used to analyze given source code
 */
#[allow(dead_code)]
struct Lexer<'a>{
    index: usize,
    code: String,
    whitespaces: String,
    terminals: Vec<&'a str>,
    lexemes: Vec<Lexeme>
}

#[allow(dead_code)]
impl<'a> Lexer<'a> {
    fn new(code: String) -> Lexer<'a> {
        Lexer {
            index: 0,
            code: code,
            whitespaces: String::from(" \t"),
            terminals: vec![
                "let","for","while","do_while","if",
                "else_if","else","continue","break","return",
                "true","false","fn",
                ">",">=","<","<=",
                "==","!=","+","-","*","/","%",
                "=",",",";","{","}","(",")","[",
                "]","\n",
            ],
            lexemes: vec![
                Lexeme::Let, Lexeme::For, Lexeme::While, Lexeme::DoWhile, Lexeme::If, Lexeme::ElseIf, Lexeme::Else,
                Lexeme::Continue, Lexeme::Break, Lexeme::Return, Lexeme::True, Lexeme::False, Lexeme::Fn, Lexeme::Greater,
                Lexeme::GreaterEqual, Lexeme::Less, Lexeme::LessEqual, Lexeme::IsEqual, Lexeme::IsNotEqual, Lexeme::Plus,
                Lexeme::Minus, Lexeme::Multiply, Lexeme::Divide, Lexeme::Modulo, Lexeme::Equals, Lexeme::Comma, Lexeme::SemiColon,
                Lexeme::OpenBrace, Lexeme::CloseBrace, Lexeme::OpenParenthesis, Lexeme::CloseParenthesis, Lexeme::OpenBracket,
                Lexeme::CloseBracket, Lexeme::Newline
            ],
        }
    }

    // returns current character
    fn getc(&self) -> char {
        self.code.chars().nth(self.index).unwrap()
    }
    // skips whitespaces
    fn skip(&mut self) {
        while self.whitespaces.contains(self.getc()) {
            self.index += 1;
        }
    }
    // returns part of remaining slice
    fn peek(&self, length: usize) -> &str {
        &self.code[self.index..self.index+length]
    }
    // returns variable token and its value
    fn variable(&mut self) -> Lexeme {
        let mut varname = String::new();
        if self.getc().is_alphabetic() {
            varname.push(self.getc());
            self.index += 1;
            while self.getc().is_alphanumeric() {
                varname.push(self.getc());
                self.index += 1;
            }
        }
        Lexeme::VariableName(varname)
    }
    // returns number token and its value
    fn number(&mut self) -> Lexeme {
        let mut n = String::new();
        while self.getc().is_numeric() {
            n.push(self.getc());
            self.index += 1;
        }
        Lexeme::Number(n)
    }
    // returns string token and its value
    fn string(&mut self) -> Lexeme {
        let mut s = String::new();
        let mut p = ' ';
        self.index += 1;
        while self.getc() != '\"' || p != '\\' {
            s.push(self.getc());
            p = self.getc();
            self.index += 1;
        }
        self.index += 1;
        Lexeme::StringLiteral(s)
    }
    // returns lexemes for each token scanned from the source code
    fn analyze(&mut self) -> Vec<Lexeme> {
        let mut lexemes = Vec::<Lexeme>::new();
        while self.index < self.code.len() - 1{
            let mut base = false;
            self.skip();
            for i in 0..self.terminals.len() {
                if self.terminals[i].len() + self.index < self.code.len() && self.peek(self.terminals[i].len()) == self.terminals[i] {
                    lexemes.push(self.lexemes[i].clone());
                    self.index += self.terminals[i].len();
                    base = true;
                    break;
                }
            }
            if !base {
                if self.getc().is_numeric() {
                    lexemes.push(self.number());
                } else if self.getc() == '\"' {
                    lexemes.push(self.string());
                } else if self.getc().is_alphabetic() {
                    lexemes.push(self.variable());
                } else {
                    println!("Syntax Error at {} : {}.", self.index, self.code.len());
                }
            }
        }
        lexemes
    }
}

fn main() {
    if env::args().count() != 2 { println!("Usage: {} <filename.fl>", env::args().nth(0).unwrap()); }
    else if !env::args().last().unwrap().ends_with("fl") { println!("Please input a valid filename. Extension should be <.fl>"); }
    else {
        let filename = env::args().last().unwrap();
        let mut f = fs::File::open(&filename).expect("FILE INPUT ERROR");
        //let mut bytes = Vec::<u8>::new();
        //f.read_to_end(&mut bytes).unwrap();
        let mut code = String::new();
        f.read_to_string(&mut code).expect("FILE READING ERROR");
        println!("Source {}:", filename);
        println!("{}", code);
        let mut lexer = Lexer::new(code);
        let lexemes = lexer.analyze();
        println!("Lexemes:");
        for l in lexemes{
            println!("{:?}", l);
        }
    }
}
