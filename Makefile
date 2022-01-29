.PHONY: all
all: help


# add_comment: 
# 	@near call ${CONTRACT_NAME} add_comment '{ "content": "this blog post is awful, I hate it" }' --accountId whilesj.testnet

# get_comments: 
# 	@near view ${CONTRACT_NAME} get_comments

## make dev-deploy
dev-deploy:
	@near dev-deploy --wasmFile target/wasm32-unknown-unknown/release/rust_cryptic_comment.wasm --accountId whilesj.testnet

## make deploy: deploy the thing
deploy:
	@near deploy --wasmFile target/wasm32-unknown-unknown/release/rust_cryptic_comment.wasm --accountId whilesj.testnet

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
