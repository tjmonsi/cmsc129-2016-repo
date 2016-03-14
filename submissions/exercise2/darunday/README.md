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

Or build the debug binary using cargo:
``` sh
cargo build
```

## Usage

Use cargo to run the compiled executable:
``` sh
cargo run <source file>.rvr
```

## Testing

Test files can be found inside the `tests/` directory. These test files are the same as the sample code in the GRAMMAR.md file.

## Release

Executable can be build without debug symbols with:
``` sh
cargo build --release
```

Release executable can be run with:
``` sh
cargo run --release -- <source file>.rvr
```
