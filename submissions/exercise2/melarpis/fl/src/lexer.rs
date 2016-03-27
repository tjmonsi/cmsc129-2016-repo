use lexeme::Lexeme;
/***
 * Structure Lexer
 * -> Lexical Analyzer structure used to analyze given source code
 */
#[allow(dead_code)]
pub struct Lexer<'a>{
    index: usize,
    errors: u32,
    code: String,
    whitespaces: String,
    terminals: Vec<&'a str>,
    lexemes: Vec<Lexeme>
}

#[allow(dead_code)]
impl<'a> Lexer<'a> {
    // trait new for Lexer structure
    pub fn new(code: String) -> Lexer<'a> {
        Lexer {
            index: 0,
            errors: 0,
            code: code,
            whitespaces: String::from(" \t"),
            terminals: vec![
                "let","for","while","do_while","if",
                "else_if","else","continue","break","return",
                "true","false","fn",
                ">",">=","<","<=",
                "==","!=","+","-","*","/","%",
                "=",",",";","{","}","(",")","[",
                "]","\n","&&", "||", "!"
            ],
            lexemes: vec![
                Lexeme::Let, Lexeme::For, Lexeme::While, Lexeme::DoWhile, Lexeme::If, Lexeme::ElseIf, Lexeme::Else,
                Lexeme::Continue, Lexeme::Break, Lexeme::Return, Lexeme::True, Lexeme::False, Lexeme::Fn, Lexeme::Greater,
                Lexeme::GreaterEqual, Lexeme::Less, Lexeme::LessEqual, Lexeme::IsEqual, Lexeme::IsNotEqual, Lexeme::Plus,
                Lexeme::Minus, Lexeme::Multiply, Lexeme::Divide, Lexeme::Modulo, Lexeme::Equals, Lexeme::Comma, Lexeme::SemiColon,
                Lexeme::OpenBrace, Lexeme::CloseBrace, Lexeme::OpenParenthesis, Lexeme::CloseParenthesis, Lexeme::OpenBracket,
                Lexeme::CloseBracket, Lexeme::Newline, Lexeme::And, Lexeme::Or, Lexeme::Not
            ],
        }
    }
    // returns lexemes for each token scanned from the source code
    pub fn analyze(&mut self) -> Vec<Lexeme> {
        let mut lexemes = Vec::<Lexeme>::new();
        while self.index < self.code.len() - 1{
            let mut construct = false;
            self.skip();
            for i in 0..self.terminals.len() {
                let is_fit = self.terminals[i].len() + self.index < self.code.len();
                if is_fit && self.peek(self.terminals[i].len()) == self.terminals[i] {
                    lexemes.push(self.lexemes[i].clone());
                    self.index += self.terminals[i].len();
                    construct = true;
                    break;
                }
            }
            if !construct {
                if self.getc().is_numeric() {
                    lexemes.push(self.number());
                } else if self.getc() == '\"' {
                    lexemes.push(self.string());
                } else if self.getc().is_alphabetic() {
                    lexemes.push(self.identifier());
                } else {
                    self.errors += 1;
                    println!("Syntax Error at {} : {}.", self.index, self.code.len());
                }
            }
        }
        if self.errors > 0 {
            println!("Total Errors : {}", self.errors);
        } else {
            println!("Build Successful!");
            println!("_________________");
        }
        lexemes
    }
    // returns number of errors
    pub fn count_errors(&mut self) -> u32 {
        self.errors
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
    // returns identifier token and its value
    fn identifier(&mut self) -> Lexeme {
        let mut varname = String::new();
        if self.getc().is_alphabetic() {
            varname.push(self.getc());
            self.index += 1;
            while self.getc().is_alphanumeric() {
                varname.push(self.getc());
                self.index += 1;
            }
        }
        Lexeme::Identifier(varname)
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
        self.index += 1;
        while self.getc() != '\"' {
            s.push(self.getc());
            self.index += 1;
        }
        self.index += 1;
        Lexeme::StringLiteral(s)
    }
}
