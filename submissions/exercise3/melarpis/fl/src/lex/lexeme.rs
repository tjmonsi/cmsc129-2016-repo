
/***
 * Enum Lexeme
 * -> lexeme tokens to be extract from the source code
 */
#[allow(dead_code)]
#[derive(Debug, Clone)]
pub enum Lexeme {
    Let, Out, In, Stdout, Stdin, For, While, Do, If, ElseIf, Else,
    Continue, Break, Return, True, False, Fn, Greater, GreaterEqual, Less, LessEqual, IsEqual, IsNotEqual,
    Plus, Minus, Multiply, Divide, Modulo, Equals, Comma, SemiColon, LBrace, RBrace, LParen, RParen, LBracket, RBracket,
    And, Or, Not, Identifier(String), StringLiteral(String), Number(String),
}

