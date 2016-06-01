mod lex;
use lex::lexeme::Lexeme;

pub struct Parser<'a> {
    next: usize,
    tokens: Vec<Lexeme>
}

impl<'a> Parser<'a> {
    pub fn new(tokens: Vec<Lexeme>) -> Parser {
        Parser {
            next: 0,
            tokens: tokens
        }
    }

    pub fn parse(&self) -> Box<Expr> {
        let mut block: Vec<Box<Expr>> = Vec::new();

        while !self.limit() {
            let stmt = match self.token.clone() {
                Lexeme::Number(ref x) => Box::new(Expr {node: self.parse_integer()}),
                Lexeme::StringLiteral(ref x) => Box::new(Expr {node: self.parse_string()}),
                Lexeme::Identifier(ref x) => Box::new(Expr {node: self.parse_id()}),
            }
        }
    }

    fn unexpected_token(&self, token: Lexeme) {
        panic!("Unexpected token found. Expected: {:?}, Found: {:?} instead.", token, self.get_token());
    }

    fn get_token(&self) -> Lexeme {
        tokens[self.next]
    }

    fn advance(&self) {
        self.next += 1;
    }

    fn limit(&self) -> bool {
        self.next == tokens.len()
    }

    fn expect(&self, token: Lexeme) -> bool {
        if self.get_token() == token { true } else { false }
    }

    fn operator(&self) -> bool {
        match self.get_token() {
            Lexeme::Plus | Lexeme::Minus | Lexeme::Multiply | Lexeme::Divide | Lexeme::Modulo => true,
            _ => false
        }
    }


}
