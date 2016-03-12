# RIVERx.rs Lexical Analyzer

RIVERx.rs is a lexical analyzer for the RIVER Programming Language written in the
[Rust](https://github.com/rust-lang/rust) language.

## Prerequisites

Install and update Rust through Multirust:
``` sh
curl -sf https://raw.githubusercontent.com/brson/multirust/master/blastoff.sh | sh
multirust set-default stable
multirust update
```
## Building

Build using cargo:
``` sh
cargo build --release
```

Or build the debug binary using cargo:
``` sh
cargo build
```

## Usage

Use cargo to run the compiled executable:
``` sh
cargo run --release -- <source file>.rvr
```
