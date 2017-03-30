# Description
## The **lexer.rs** is a rust implementation of a lexical analyzer for F Language using Deterministic Finite-state Automata.
-------------


#How To Run
-------------

**Requirements**

- [rust ^1.7.0](https://www.rust-lang.org/downloads.html)
- [cargo ^0.8.0](http://doc.crates.io/)
- file with extension **.fl**

**Installation**
```bash
curl -sf https://raw.githubusercontent.com/brson/multirust/master/blastoff.sh | sh
multirust set-default stable
multirust update
```

**Build**
```bash
$ cargo build lexer
```

**Sample Run**
```bash
$ cargo run <filename.fl>
$ #_OR_
$ ./lexer/src/main/lexer <filename.fl>
```

**Test**
```bash
$ cargo test
```
