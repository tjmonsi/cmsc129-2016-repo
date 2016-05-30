use std::*;
use std::io::prelude::*;
mod lex;
use lex::lexer::Lexer;

fn main() {
    if env::args().count() != 2 { println!("Usage: {} <filename.fl>", env::args().nth(0).unwrap()); }
    else if !env::args().last().unwrap().ends_with("fl") { println!("Please input a valid filename. Extension should be <.fl>"); }
    else {
        let filename = env::args().last().unwrap();
        let mut f = fs::File::open(&filename).expect("FILE INPUT ERROR");
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

#[allow(unused_variables)]
#[test]
fn test() {
    let mut f = fs::File::open("tests/test.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code);
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 0);
}

#[allow(unused_variables)]
#[test]
fn correct_test_1() {
    let mut f = fs::File::open("tests/correct1.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code);
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 0);
}

#[allow(unused_variables)]
#[test]
fn correct_test_2() {
    let mut f = fs::File::open("tests/correct2.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code);
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 0);
}

#[allow(unused_variables)]
#[test]
fn correct_test_3() {
    let mut f = fs::File::open("tests/correct3.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code.clone());
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 0);
}

#[allow(unused_variables)]
#[test]
fn error_test_1() {
    let mut f = fs::File::open("tests/error1.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code);
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 5);
}

#[allow(unused_variables)]
#[test]
fn error_test_2() {
    let mut f = fs::File::open("tests/error2.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code);
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 6);
}

#[allow(unused_variables)]
#[test]
fn error_test_3() {
    let mut f = fs::File::open("tests/error3.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code.clone());
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 7);
}

#[allow(unused_variables)]
#[test]
fn error_test_4() {
    let mut f = fs::File::open("tests/error4.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code);
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 8);
}

#[allow(unused_variables)]
#[test]
fn error_test_5() {
    let mut f = fs::File::open("tests/error5.fl").expect("FILE INPUT ERROR");
    let mut code = String::new();
    f.read_to_string(&mut code).expect("FILE READING ERROR");
    let mut lexer = Lexer::new(code.clone());
    let lexemes = lexer.analyze();
    let errors = lexer.count_errors();
    assert_eq!(errors, 9);
}
