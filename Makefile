.PHONY: all
all: help

increment: 
	@near call whilesj.testnet increment --accountId whilesj.testnet

decrement: 
	@near call whilesj.testnet decrement --accountId whilesj.testnet

get_num: 
	@near view whilesj.testnet get_num 

## make deploy: deploy the thing
deploy:
	@near deploy --wasmFile target/wasm32-unknown-unknown/release/rust_counter_tutorial.wasm --accountId whilesj.testnet

## make login: login into near, needed for deployment
login:
	@near login

## make test: run unit tests
test:
	@cargo test -- --nocapture

## make build: build a version of the package for release to the chain
build:
	@cargo build --target wasm32-unknown-unknown --release

## help: Show help and exit.
help: Makefile
	@echo
	@echo "  Choose a command:"
	@echo
	@sed -n 's/^##//p' $< | column -t -s ':' |  sed -e 's/^/ /'
	@echo
